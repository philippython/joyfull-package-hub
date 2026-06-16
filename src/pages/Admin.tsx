import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin, claimAdmin, getMyOrders, adminListProducts, adminListOrders, upsertProduct, deleteProduct, updateOrderStatus } from "@/lib/api";
import { formatCents } from "@/lib/format";

export default function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { navigate("/login?redirect=/admin"); } else { setAuthed(true); setReady(true); }
    });
  }, [navigate]);
  if (!ready || !authed) return <SiteLayout><div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div></SiteLayout>;
  return <AdminInner />;
}

function AdminInner() {
  const { data: roleData, isLoading } = useQuery({ queryKey: ["isAdmin"], queryFn: checkIsAdmin, staleTime: 30_000, retry: false });
  const signOut = async () => { await supabase.auth.signOut(); window.location.href = "/"; };
  if (isLoading) return <SiteLayout><div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div></SiteLayout>;
  if (!roleData?.isAdmin) return (
    <SiteLayout>
      <div className="min-h-[70vh] pt-32 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-serif text-3xl text-burgundy-deep">My Orders</h1>
            <div className="flex gap-3"><ClaimAdminButton /><button onClick={signOut} className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)]">Sign out</button></div>
          </div>
          <MyOrders />
        </div>
      </div>
    </SiteLayout>
  );
  return (
    <SiteLayout>
      <div className="pt-32 pb-20 px-6 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div><div className="eyebrow">Admin</div><h1 className="font-serif text-4xl text-burgundy-deep mt-2">Rewindd Dashboard</h1></div>
            <button onClick={signOut} className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)]">Sign out</button>
          </div>
          <ProductsManager />
          <OrdersManager />
        </div>
      </div>
    </SiteLayout>
  );
}

function ClaimAdminButton() {
  const qc = useQueryClient();
  return (
    <button onClick={async () => {
      try { await claimAdmin(); toast.success("You are now admin"); await qc.invalidateQueries({ queryKey: ["isAdmin"] }); }
      catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    }} className="btn-primary">Claim Admin</button>
  );
}

function MyOrders() {
  const { data } = useQuery({ queryKey: ["myOrders"], queryFn: getMyOrders });
  if (!data?.length) return <p className="text-warm-gray">No orders yet. <Link to="/kit" className="text-burgundy underline">Order a kit</Link></p>;
  return (
    <div className="space-y-3">
      {data.map((o: any) => (
        <div key={o.id} className="bg-white p-5 border-l-2 border-gold flex justify-between">
          <div><div className="font-serif text-lg text-burgundy-deep">{o.products?.name ?? "Order"}</div><div className="text-xs text-warm-gray">{new Date(o.created_at).toLocaleString()}</div></div>
          <div className="text-right"><div className="font-serif text-xl">{formatCents(o.amount_cents, o.currency)}</div><div className="text-[11px] uppercase tracking-widest text-gold">{o.status}</div></div>
        </div>
      ))}
    </div>
  );
}

function ProductsManager() {
  const qc = useQueryClient();
  const { data: products } = useQuery({ queryKey: ["adminProducts"], queryFn: adminListProducts, staleTime: 10_000 });
  const [editing, setEditing] = useState<any | null>(null);
  const blankProduct = { name: "", slug: "", tagline: "", description: "", price_cents: 0, currency: "gbp", items_included: [], image_urls: [], image_url: "", is_active: true, sort_order: 0 };
  const save = async (p: any) => {
    try { await upsertProduct(p); toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["adminProducts"] }); qc.invalidateQueries({ queryKey: ["products"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  };
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-burgundy-deep">Products</h2>
        <button onClick={() => setEditing(blankProduct)} className="btn-primary !py-2">+ New Product</button>
      </div>
      <div className="space-y-2">
        {products?.map((p: any) => (
          <div key={p.id} className="bg-white p-5 flex justify-between items-center border-l-2 border-gold">
            <div className="flex gap-4 items-center min-w-0">
              {(p.image_urls?.[0] || p.image_url) && <img src={p.image_urls?.[0] || p.image_url} alt={p.name} className="w-12 h-12 object-cover shrink-0 border border-burgundy/10" />}
              <div className="min-w-0">
                <div className="font-serif text-lg text-burgundy-deep truncate">{p.name} {!p.is_active && <span className="text-xs text-warm-gray">(inactive)</span>}</div>
                <div className="text-xs text-warm-gray truncate">{p.slug} · {formatCents(p.price_cents, p.currency)} · {(p.items_included ?? []).length} items</div>
              </div>
            </div>
            <div className="flex gap-3 shrink-0 ml-4">
              <button onClick={() => setEditing(p)} className="text-xs uppercase tracking-widest text-burgundy hover:text-burgundy-deep">Edit</button>
              <button onClick={async () => { if (confirm(`Delete "${p.name}"?`)) { await deleteProduct(p.id); toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["adminProducts"] }); } }} className="text-xs uppercase tracking-widest text-warm-gray hover:text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && <ProductEditor product={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </section>
  );
}

function ProductEditor({ product, onCancel, onSave }: { product: any; onCancel: () => void; onSave: (p: any) => void }) {
  const [p, setP] = useState({ ...product, items_included_text: (product.items_included ?? []).join("\n"), image_urls_text: Array.isArray(product.image_urls) ? product.image_urls.join("\n") : product.image_url ? String(product.image_url).trim() : "", price_pounds: ((product.price_cents ?? 0) / 100).toFixed(2) });
  const previewImages = String(p.image_urls_text).split("\n").map((s: string) => s.trim()).filter(Boolean).slice(0, 10);
  const input = "w-full bg-white border border-burgundy/15 px-4 py-2.5 text-sm focus:outline-none focus:border-gold transition";
  const label = "block text-xs uppercase tracking-wider text-warm-gray mb-1";
  const field = (labelText: string, children: React.ReactNode) => <div><label className={label}>{labelText}</label>{children}</div>;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: p.id, name: p.name.trim(), slug: p.slug.trim().toLowerCase().replace(/\s+/g, "-"), tagline: p.tagline?.trim() ?? "", description: p.description.trim(), price_cents: Math.round(Number(p.price_pounds) * 100), currency: (p.currency || "gbp").trim().toLowerCase(), image_url: previewImages[0] ?? "", image_urls: previewImages, items_included: String(p.items_included_text).split("\n").map((s: string) => s.trim()).filter(Boolean), is_active: !!p.is_active, sort_order: Number(p.sort_order) || 0 });
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-cream max-w-3xl w-full p-8 space-y-5 my-8">
        <div className="flex justify-between items-center">
          <h3 className="font-serif text-2xl text-burgundy-deep">{p.id ? "Edit Product" : "New Product"}</h3>
          <button type="button" onClick={onCancel} className="text-warm-gray hover:text-charcoal text-xl leading-none">✕</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {field("Product Name *", <input required placeholder="e.g. Date Night Box" value={p.name} onChange={(e) => { const name = e.target.value; const autoSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80); setP((prev: any) => ({ ...prev, name, slug: prev._slugManuallyEdited ? prev.slug : autoSlug })); }} className={input} />)}
          <div>
            <label className={label}>URL Slug *</label>
            <input required value={p.slug} onChange={(e) => setP((prev: any) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"), _slugManuallyEdited: true }))} className={input} />
          </div>
        </div>
        {field("Tagline", <input placeholder="Short tagline" value={p.tagline ?? ""} onChange={(e) => setP({ ...p, tagline: e.target.value })} className={input} />)}
        {field("Description *", <textarea required value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} className={`${input} min-h-[180px] font-mono text-xs`} />)}
        <div className="grid grid-cols-3 gap-4">
          {field("Price (£) *", <input required type="number" step="0.01" min="0" value={p.price_pounds} onChange={(e) => setP({ ...p, price_pounds: e.target.value })} className={input} />)}
          {field("Currency", <input placeholder="gbp" value={p.currency} onChange={(e) => setP({ ...p, currency: e.target.value })} className={input} />)}
          {field("Sort Order", <input type="number" value={p.sort_order} onChange={(e) => setP({ ...p, sort_order: e.target.value })} className={input} />)}
        </div>
        {field("Image URLs — one per line", <textarea placeholder="https://..." value={p.image_urls_text} onChange={(e) => setP({ ...p, image_urls_text: e.target.value })} className={`${input} min-h-[100px] font-mono text-xs`} />)}
        {previewImages.length > 0 && <div><p className={label}>Image Preview</p><div className="flex gap-2 flex-wrap">{previewImages.map((src, i) => <img key={i} src={src} alt={`preview ${i + 1}`} className="w-16 h-16 object-cover border border-burgundy/15" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0.3"; }} />)}</div></div>}
        {field("What's included — one per line", <textarea value={p.items_included_text} onChange={(e) => setP({ ...p, items_included_text: e.target.value })} className={`${input} min-h-[160px]`} />)}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={p.is_active} onChange={(e) => setP({ ...p, is_active: e.target.checked })} className="w-4 h-4 accent-gold" />
          <span className="text-sm text-charcoal">Active — visible to customers</span>
        </label>
        <div className="flex gap-3 pt-2 border-t border-burgundy/10">
          <button type="submit" className="btn-primary">Save Product</button>
          <button type="button" onClick={onCancel} className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)]">Cancel</button>
        </div>
      </form>
    </div>
  );
}

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;
function OrdersManager() {
  const qc = useQueryClient();
  const { data: orders } = useQuery({ queryKey: ["adminOrders"], queryFn: adminListOrders, staleTime: 10_000 });
  return (
    <section>
      <h2 className="font-serif text-2xl text-burgundy-deep mb-6">Orders {orders?.length ? <span className="text-base font-sans text-warm-gray ml-2">({orders.length})</span> : null}</h2>
      <div className="space-y-2">
        {!orders?.length && <p className="text-warm-gray text-sm">No orders yet.</p>}
        {orders?.map((o: any) => (
          <details key={o.id} className="bg-white border-l-2 border-gold group">
            <summary className="p-5 cursor-pointer flex justify-between items-center list-none">
              <div className="min-w-0">
                <div className="font-serif text-lg text-burgundy-deep truncate">{o.customer_name} · {o.products?.name}</div>
                <div className="text-xs text-warm-gray">{new Date(o.created_at).toLocaleString("en-GB")} · {o.customer_email}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                <span className="font-serif text-lg">{formatCents(o.amount_cents, o.currency)}</span>
                <select value={o.status} onClick={(e) => e.stopPropagation()} onChange={async (e) => { await updateOrderStatus(o.id, e.target.value); toast.success("Status updated"); qc.invalidateQueries({ queryKey: ["adminOrders"] }); }} className="text-[11px] uppercase tracking-widest border border-burgundy/20 px-2 py-1 bg-white focus:outline-none focus:border-gold">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </summary>
            <div className="px-5 pb-5 text-sm text-warm-gray border-t border-burgundy/5">
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="font-medium text-charcoal mb-2 text-xs uppercase tracking-wider">Shipping Address</div>
                  <pre className="text-xs whitespace-pre-wrap bg-cream p-3 border border-burgundy/10 leading-relaxed">{JSON.stringify(o.shipping_address, null, 2)}</pre>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="font-medium text-charcoal text-xs uppercase tracking-wider mb-2">Order Details</div>
                  <p><span className="text-charcoal">Order ID:</span> <span className="font-mono">{o.id}</span></p>
                  <p><span className="text-charcoal">Quantity:</span> {o.quantity}</p>
                  <p><span className="text-charcoal">Amount:</span> {formatCents(o.amount_cents, o.currency)}</p>
                  <p><span className="text-charcoal">Status:</span> <span className="uppercase text-gold">{o.status}</span></p>
                  <p><span className="text-charcoal">Placed:</span> {new Date(o.created_at).toLocaleString("en-GB")}</p>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
