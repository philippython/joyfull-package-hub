import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: -1 } },
  });
}

function paypalBase() {
  return (process.env.PAYPAL_BASE_URL || "https://api-m.paypal.com").replace(/\/$/, "");
}

async function paypalAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error("PayPal is not configured");
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const r = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(j.error_description || "PayPal auth failed");
  return j.access_token;
}

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const data = await req.json();
    const admin = adminClient();

    const { data: product, error: pErr } = await admin
      .from("products")
      .select("id, name, price_cents, currency, is_active")
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
        shipping_address: {
          ...data.shippingAddress,
          phone: data.phone,
          notes: data.notes,
          provider: "paypal",
        },
      })
      .select("id")
      .single();
    if (oErr) return new Response(JSON.stringify({ error: oErr.message }), { status: 500 });

    const origin = process.env.PUBLIC_URL || new URL(req.url).origin;

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return new Response(
        JSON.stringify({ url: `${origin}/order-success?id=${order.id}`, orderId: order.id }),
        { status: 200 },
      );
    }

    const token = await paypalAccessToken();
    const valueMajor = (amount / 100).toFixed(2);
    const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          amount: { currency_code: product.currency.toUpperCase(), value: valueMajor },
          description: product.name.slice(0, 127),
        },
      ],
      application_context: {
        brand_name: "Rewindd",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: `${origin}/paypal-return?id=${order.id}`,
        cancel_url: `${origin}/checkout?slug=${product.id}`,
      },
    };

    const r = await fetch(`${paypalBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    if (!r.ok || !j.id)
      return new Response(JSON.stringify({ error: j.message || "PayPal order failed" }), {
        status: 500,
      });

    const approve = j.links?.find((l) => l.rel === "approve")?.href;
    if (!approve)
      return new Response(JSON.stringify({ error: "PayPal approval URL missing" }), {
        status: 500,
      });

    await admin
      .from("orders")
      .update({ stripe_session_id: `paypal:${j.id}` })
      .eq("id", order.id);
    return new Response(JSON.stringify({ url: approve, orderId: order.id }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
