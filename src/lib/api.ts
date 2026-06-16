import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function callEdgeFunction(name: string, body: any) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function listProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function checkIsAdmin(): Promise<{ isAdmin: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false };
  const { data } = await supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();
  return { isAdmin: !!data };
}

export async function claimAdmin(): Promise<{ ok: boolean }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { count, error: cErr } = await supabase
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  if (cErr) throw new Error(cErr.message);
  if ((count ?? 0) > 0) throw new Error("An admin already exists. Contact the existing admin.");
  const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function getMyOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name, slug)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminListProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminListOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*, products(name)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function upsertProduct(p: any) {
  const payload = {
    ...p,
    image_url: p.image_url || null,
    image_urls: p.image_urls?.length ? p.image_urls : null,
    tagline: p.tagline || null,
  };
  if (p.id) {
    const { error } = await supabase.from("products").update(payload).eq("id", p.id);
    if (error) throw new Error(error.message);
    return { ok: true, id: p.id };
  }
  const { data: row, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return { ok: true, id: row.id };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ── Payments (via Supabase Edge Functions) ────────────────────────────────────

export async function createPaymentIntent(payload: any) {
  return callEdgeFunction("create-payment-intent", payload);
}

export async function createPayPalOrder(payload: any) {
  return callEdgeFunction("create-paypal-order", {
    ...payload,
    origin: window.location.origin,
  });
}

export async function capturePayPalOrder(payload: { orderId: string; token: string }) {
  return callEdgeFunction("capture-paypal-order", payload);
}
