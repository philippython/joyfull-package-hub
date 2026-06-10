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

const addressSchema = z.object({
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().min(1).max(20),
  country: z.string().trim().min(2).max(60),
});

export const createCheckoutSession = createServerFn({ method: "POST" })
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
    const key = process.env.STRIPE_SECRET_KEY;
    const admin = adminClient();

    const { data: product, error: pErr } = await admin
      .from("products")
      .select("id, name, price_cents, currency, image_url, image_urls, is_active")
      .eq("id", data.productId)
      .single();
    if (pErr || !product) throw new Error("Product not found");
    if (!product.is_active) throw new Error("Product unavailable");

    const amount = product.price_cents * data.quantity;

    // Create pending order first so we can correlate webhooks
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
        },
      })
      .select("id")
      .single();
    if (oErr) throw new Error(oErr.message);

    const origin = getOrigin();

    if (!key) {
      // Stripe not configured yet — fall back to direct success redirect
      return {
        url: `${origin}/order-success?id=${order.id}`,
        orderId: order.id,
        stripeEnabled: false,
      };
    }

    const firstImage =
      (Array.isArray(product.image_urls) && (product.image_urls as string[])[0]) ||
      product.image_url ||
      null;

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("payment_method_types[0]", "card");
    params.set("line_items[0][quantity]", String(data.quantity));
    params.set("line_items[0][price_data][currency]", product.currency.toLowerCase());
    params.set("line_items[0][price_data][unit_amount]", String(product.price_cents));
    params.set("line_items[0][price_data][product_data][name]", product.name);
    if (firstImage && /^https?:\/\//i.test(firstImage)) {
      params.set("line_items[0][price_data][product_data][images][0]", firstImage);
    }
    params.set("customer_email", data.customerEmail);
    params.set("success_url", `${origin}/order-success?id=${order.id}&session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${origin}/checkout?slug=${product.id}`);
    params.set("metadata[order_id]", order.id);
    params.set("metadata[product_id]", product.id);
    // Pre-fill shipping into Stripe so user sees it
    params.set("shipping_address_collection[allowed_countries][0]", "GB");

    const resp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
    const json = (await resp.json()) as { url?: string; id?: string; error?: { message?: string } };
    if (!resp.ok || !json.url) {
      throw new Error(json.error?.message || "Stripe session creation failed");
    }

    await admin.from("orders").update({ stripe_session_id: json.id ?? null }).eq("id", order.id);

    return { url: json.url, orderId: order.id, stripeEnabled: true };
  });
