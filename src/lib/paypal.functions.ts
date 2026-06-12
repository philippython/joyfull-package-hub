import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function adminClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

function getOrigin() {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/$/, "");
  try {
    const req = getRequest();
    const url = new URL(req.url);
    const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
    return `${proto}://${host}`;
  } catch {
    return "";
  }
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
  const j = (await r.json()) as { access_token?: string; error_description?: string };
  if (!r.ok || !j.access_token) throw new Error(j.error_description || "PayPal auth failed");
  return j.access_token;
}

const addressSchema = z.object({
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().min(1).max(20),
  country: z.string().trim().min(2).max(60),
});

export const createPayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(10).default(1),
        customerName: z.string().trim().min(1).max(120),
        customerEmail: z.string().trim().email().max(200),
        phone: z.string().trim().max(40).optional().or(z.literal("")),
        shippingAddress: addressSchema,
        notes: z.string().trim().max(500).optional().or(z.literal("")),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    const admin = adminClient();
    const { data: product, error: pErr } = await admin
      .from("products")
      .select("id, name, price_cents, currency, is_active")
      .eq("id", data.productId)
      .single();
    if (pErr || !product) throw new Error("Product not found");
    if (!product.is_active) throw new Error("Product unavailable");

    const amount = product.price_cents * data.quantity;

    const { data: order, error: oErr } = await admin
      .from("orders")
      .insert({
        product_id: product.id,
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        amount_cents: amount,
        currency: product.currency,
        quantity: data.quantity,
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
    if (oErr) throw new Error(oErr.message);

    const origin = getOrigin();

    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      return {
        url: `${origin}/order-success?id=${order.id}`,
        orderId: order.id,
        paypalEnabled: false,
      };
    }

    const token = await paypalAccessToken();
    const valueMajor = (amount / 100).toFixed(2);

    const body = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          amount: {
            currency_code: product.currency.toUpperCase(),
            value: valueMajor,
          },
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
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const j = (await r.json()) as {
      id?: string;
      links?: { href: string; rel: string; method: string }[];
      message?: string;
    };
    if (!r.ok || !j.id) throw new Error(j.message || "PayPal order creation failed");
    const approve = j.links?.find((l) => l.rel === "approve")?.href;
    if (!approve) throw new Error("PayPal approval URL missing");

    await admin
      .from("orders")
      .update({ stripe_session_id: `paypal:${j.id}` })
      .eq("id", order.id);

    return { url: approve, orderId: order.id, paypalEnabled: true };
  });

export const capturePayPalOrder = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z.object({ orderId: z.string().uuid(), token: z.string().min(1).max(200) }).parse(raw),
  )
  .handler(async ({ data }) => {
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
      throw new Error("PayPal is not configured");
    }
    const accessToken = await paypalAccessToken();
    const r = await fetch(`${paypalBase()}/v2/checkout/orders/${data.token}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    const j = (await r.json()) as { status?: string; message?: string };
    if (!r.ok) throw new Error(j.message || "PayPal capture failed");

    if (j.status === "COMPLETED") {
      const admin = adminClient();
      await admin.from("orders").update({ status: "paid" }).eq("id", data.orderId);
    }
    return { status: j.status ?? "UNKNOWN" };
  });
