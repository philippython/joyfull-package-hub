import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { productId, quantity, customerName, customerEmail, phone, shippingAddress, notes } =
      await req.json();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: product, error: pErr } = await admin
      .from("products")
      .select("id, name, price_cents, currency, is_active")
      .eq("id", productId)
      .single();
    if (pErr || !product)
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    if (!product.is_active)
      return new Response(JSON.stringify({ error: "Product unavailable" }), {
        status: 400,
        headers: corsHeaders,
      });

    const amount = product.price_cents * (quantity ?? 1);

    const { data: order, error: oErr } = await admin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_email: customerEmail,
        customer_name: customerName,
        amount_cents: amount,
        currency: product.currency,
        quantity: quantity ?? 1,
        status: "pending",
        shipping_address: { ...shippingAddress, phone, notes },
      })
      .select("id")
      .single();
    if (oErr)
      return new Response(JSON.stringify({ error: oErr.message }), {
        status: 500,
        headers: corsHeaders,
      });

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY")!;
    const params = new URLSearchParams();
    params.set("amount", String(amount));
    params.set("currency", product.currency.toLowerCase());
    params.set("metadata[order_id]", order.id);
    params.set("metadata[customer_name]", customerName);
    params.set("metadata[customer_email]", customerEmail);
    params.set("receipt_email", customerEmail);
    params.set("description", product.name);

    const resp = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const pi = await resp.json();
    if (!resp.ok)
      return new Response(JSON.stringify({ error: pi.error?.message || "Stripe failed" }), {
        status: 500,
        headers: corsHeaders,
      });

    await admin.from("orders").update({ stripe_session_id: pi.id }).eq("id", order.id);

    return new Response(JSON.stringify({ clientSecret: pi.client_secret, orderId: order.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
