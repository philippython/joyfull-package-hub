import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const noRealtime = {
  realtime: { params: { eventsPerSecond: -1 } },
  auth: { persistSession: false, autoRefreshToken: false },
};

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    noRealtime,
  );
}

function adminClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    noRealtime,
  );
}

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string().min(1).max(100) }))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: row, error } = await sb
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

const addressSchema = z.object({
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().max(100).optional().or(z.literal("")),
  postal_code: z.string().trim().min(1).max(20),
  country: z.string().trim().min(2).max(60),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((raw) =>
    z
      .object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(10),
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
      .select("price_cents, currency, is_active")
      .eq("id", data.productId)
      .single();
    if (pErr || !product) throw new Error("Product not found");
    if (!product.is_active) throw new Error("Product unavailable");

    const amount = product.price_cents * data.quantity;
    const { data: order, error } = await admin
      .from("orders")
      .insert({
        product_id: data.productId,
        customer_email: data.customerEmail,
        customer_name: data.customerName,
        amount_cents: amount,
        currency: product.currency,
        quantity: data.quantity,
        status: "pending",
        shipping_address: { ...data.shippingAddress, phone: data.phone, notes: data.notes },
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { orderId: order.id };
  });

export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("*, products(name, slug)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/* ---------- ADMIN ---------- */

async function assertAdmin(userId: string) {
  const admin = adminClient();
  const { data, error } = await admin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = adminClient();
    const { count, error: cErr } = await admin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw new Error(cErr.message);
    if ((count ?? 0) > 0) throw new Error("An admin already exists. Contact the existing admin.");
    const { error } = await admin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const admin = adminClient();
    const { data } = await admin
      .from("user_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const admin = adminClient();
    const { data, error } = await admin
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const admin = adminClient();
    const { data, error } = await admin
      .from("orders")
      .select("*, products(name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "lowercase, numbers, dashes only"),
  tagline: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().min(1).max(4000),
  price_cents: z.number().int().min(0).max(10_000_000),
  currency: z.string().trim().length(3).default("usd"),
  image_url: z.string().trim().max(500).optional().or(z.literal("")),
  image_urls: z.array(z.string().trim().url()).max(10).optional().default([]),
  items_included: z.array(z.string().trim().min(1).max(300)).max(30),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().min(0).max(1000).default(0),
});

export const upsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => productInput.parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = adminClient();
    const payload = {
      ...data,
      image_url: data.image_url || null,
      image_urls: data.image_urls?.length ? data.image_urls : null,
      tagline: data.tagline || null,
    };
    if (data.id) {
      const { error } = await admin.from("products").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: row, error } = await admin.from("products").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) => z.object({ id: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = adminClient();
    const { error } = await admin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled"]),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const admin = adminClient();
    const { error } = await admin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
