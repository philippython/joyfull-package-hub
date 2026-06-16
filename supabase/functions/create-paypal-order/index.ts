import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function paypalBase() {
  return (Deno.env.get("PAYPAL_BASE_URL") || "https://api-m.paypal.com").replace(/\/$/, "");
}

async function paypalAccessToken() {
  const id = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
  const auth = btoa(`${id}:${secret}`);
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const {
      productId,
      quantity,
      customerName,
      customerEmail,
      phone,
      shippingAddress,
      notes,
      origin,
    } = await req.json();

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
        shipping_address: { ...shippingAddress, phone, notes, provider: "paypal" },
      })
      .select("id")
      .single();
    if (oErr)
      return new Response(JSON.stringify({ error: oErr.message }), {
        status: 500,
        headers: corsHeaders,
      });

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
        headers: corsHeaders,
      });

    const approve = j.links?.find((l: any) => l.rel === "approve")?.href;
    if (!approve)
      return new Response(JSON.stringify({ error: "PayPal approval URL missing" }), {
        status: 500,
        headers: corsHeaders,
      });

    await admin
      .from("orders")
      .update({ stripe_session_id: `paypal:${j.id}` })
      .eq("id", order.id);

    return new Response(JSON.stringify({ url: approve, orderId: order.id }), {
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
