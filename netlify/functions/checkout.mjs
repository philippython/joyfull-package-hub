import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: -1 } },
  });
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const data = await req.json();
    const admin = adminClient();

    const { data: product, error: pErr } = await admin
      .from("products")
      .select("id, name, price_cents, currency, image_url, image_urls, is_active")
      .eq("id", data.productId)
      .single();
    if (pErr || !product)
      return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    if (!product.is_active)
      return new Response(JSON.stringify({ error: "Product unavailable" }), { status: 400 });

    const amount = product.price_cents * (data.quantity ?? 1);

    const { data: order, error: oErr } = await admin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        amount_cents: amount,
        currency: product.currency,
        quantity: data.quantity ?? 1,
        status: "pending",
        shipping_address: { ...data.shippingAddress, phone: data.phone, notes: data.notes },
      })
      .select("id")
      .single();
    if (oErr) return new Response(JSON.stringify({ error: oErr.message }), { status: 500 });

    const origin = process.env.PUBLIC_URL || new URL(req.url).origin;
    const key = process.env.STRIPE_SECRET_KEY;

    if (!key) {
      return new Response(
        JSON.stringify({ url: `${origin}/order-success?id=${order.id}`, orderId: order.id }),
        { status: 200 },
      );
    }

    const firstImage =
      (Array.isArray(product.image_urls) && product.image_urls[0]) || product.image_url || null;
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("payment_method_types[0]", "card");
    params.set("line_items[0][quantity]", String(data.quantity ?? 1));
    params.set("line_items[0][price_data][currency]", product.currency.toLowerCase());
    params.set("line_items[0][price_data][unit_amount]", String(product.price_cents));
    params.set("line_items[0][price_data][product_data][name]", product.name);
    if (firstImage && /^https?:\/\//i.test(firstImage)) {
      params.set("line_items[0][price_data][product_data][images][0]", firstImage);
    }
    params.set("customer_email", data.customerEmail);
    params.set(
      "success_url",
      `${origin}/order-success?id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    );
    params.set("cancel_url", `${origin}/checkout?slug=${product.id}`);
    params.set("metadata[order_id]", order.id);
    params.set("shipping_address_collection[allowed_countries][0]", "GB");

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const json = await resp.json();
    if (!resp.ok || !json.url) {
      return new Response(JSON.stringify({ error: json.error?.message || "Stripe failed" }), {
        status: 500,
      });
    }

    await admin
      .from("orders")
      .update({ stripe_session_id: json.id ?? null })
      .eq("id", order.id);
    return new Response(JSON.stringify({ url: json.url, orderId: order.id }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const config = { path: "/.netlify/functions/checkout" };
