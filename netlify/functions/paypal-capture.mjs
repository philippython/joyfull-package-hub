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
    const { orderId, token } = await req.json();
    const accessToken = await paypalAccessToken();
    const r = await fetch(`${paypalBase()}/v2/checkout/orders/${token}/capture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    });
    const j = await r.json();
    if (!r.ok)
      return new Response(JSON.stringify({ error: j.message || "PayPal capture failed" }), {
        status: 500,
      });

    if (j.status === "COMPLETED") {
      const admin = adminClient();
      await admin.from("orders").update({ status: "paid" }).eq("id", orderId);
    }
    return new Response(JSON.stringify({ status: j.status ?? "UNKNOWN" }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
