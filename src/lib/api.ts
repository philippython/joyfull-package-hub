import { supabase } from '@/integrations/supabase/client';

// ── Products ──────────────────────────────────────────────────────────────────

export async function listProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function checkIsAdmin(): Promise<{ isAdmin: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false };
  const { data } = await supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();
  return { isAdmin: !!data };
}

export async function claimAdmin(): Promise<{ ok: boolean }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { count, error: cErr } = await supabase
    .from('user_roles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin');
  if (cErr) throw new Error(cErr.message);
  if ((count ?? 0) > 0) throw new Error('An admin already exists. Contact the existing admin.');
  const { error } = await supabase
    .from('user_roles')
    .insert({ user_id: user.id, role: 'admin' });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function getMyOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(name, slug)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export async function adminListProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminListOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, products(name)')
    .order('created_at', { ascending: false });
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
    const { error } = await supabase.from('products').update(payload).eq('id', p.id);
    if (error) throw new Error(error.message);
    return { ok: true, id: p.id };
  }
  const { data: row, error } = await supabase.from('products').insert(payload).select('id').single();
  if (error) throw new Error(error.message);
  return { ok: true, id: row.id };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ── Checkout (via Netlify Functions) ─────────────────────────────────────────

export async function createCheckoutSession(payload: any) {
  const res = await fetch('/.netlify/functions/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Checkout failed');
  return json;
}

export async function createPayPalOrder(payload: any) {
  const res = await fetch('/.netlify/functions/paypal-create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'PayPal order failed');
  return json;
}

export async function capturePayPalOrder(payload: { orderId: string; token: string }) {
  const res = await fetch('/.netlify/functions/paypal-capture', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'PayPal capture failed');
  return json;
}
