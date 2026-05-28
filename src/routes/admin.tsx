import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import {
  adminListProducts, adminListOrders, upsertProduct, deleteProduct,
  updateOrderStatus, checkIsAdmin, claimAdmin, getMyOrders,
} from "@/lib/products.functions";
import { formatCents } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Rewindd" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/login", search: { redirect: "/admin" } });
      } else {
        setAuthed(true);
        setReady(true);
      }
    });
  }, [navigate]);

  if (!ready || !authed) {
    return <SiteLayout><div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div></SiteLayout>;
  }
  return <AdminInner />;
}

function AdminInner() {
  const checkAdmin = useServerFn(checkIsAdmin);
  const { data: roleData, isLoading } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => checkAdmin(),
  });

  const signOut = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

  if (isLoading) return <SiteLayout><div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div></SiteLayout>;

  if (!roleData?.isAdmin) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] pt-32 px-6 bg-cream">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="font-serif text-3xl text-burgundy-deep">My Orders</h1>
              <div className="flex gap-3">
                <ClaimAdminButton />
                <button onClick={signOut} className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)]">Sign out</button>
              </div>
            </div>
            <MyOrders />
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="pt-32 pb-20 px-6 bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div className="eyebrow">Admin</div>
              <h1 className="font-serif text-4xl text-burgundy-deep mt-2">Rewindd Dashboard</h1>
            </div>
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
  const claim = useServerFn(claimAdmin);
  const qc = useQueryClient();
  return (
    <button
      onClick={async () => {
        try { await claim(); toast.success("You are now admin"); qc.invalidateQueries(); }
        catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
      }}
      className="btn-primary"
    >
      Claim Admin
    </button>
  );
}

function MyOrders() {
  const fn = useServerFn(getMyOrders);
  const { data } = useQuery({ queryKey: ["myOrders"], queryFn: () => fn() });
  if (!data?.length) return <p className="text-warm-gray">No orders yet. <Link to="/kit" className="text-burgundy underline">Order a kit</Link></p>;
  return (
    <div className="space-y-3">
      {data.map((o: any) => (
        <div key={o.id} className="bg-white p-5 border-l-2 border-gold flex justify-between">
          <div>
            <div className="font-serif text-lg text-burgundy-deep">{o.products?.name ?? "Order"}</div>
            <div className="text-xs text-warm-gray">{new Date(o.created_at).toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="font-serif text-xl">{formatCents(o.amount_cents, o.currency)}</div>
            <div className="text-[11px] uppercase tracking-widest text-gold">{o.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsManager() {
  const list = useServerFn(adminListProducts);
  const upsert = useServerFn(upsertProduct);
  const del = useServerFn(deleteProduct);
  const qc = useQueryClient();
  const { data: products } = useQuery({ queryKey: ["adminProducts"], queryFn: () => list() });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async (p: any) => {
    try {
      await upsert({ data: p });
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  };

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl text-burgundy-deep">Packages</h2>
        <button onClick={() => setEditing({ name: "", slug: "", description: "", price_cents: 0, currency: "usd", items_included: [], is_active: true, sort_order: 0 })} className="btn-primary !py-2">+ New Package</button>
      </div>
      <div className="space-y-2">
        {products?.map((p: any) => (
          <div key={p.id} className="bg-white p-5 flex justify-between items-center border-l-2 border-gold">
            <div>
              <div className="font-serif text-lg text-burgundy-deep">{p.name} {!p.is_active && <span className="text-xs text-warm-gray">(inactive)</span>}</div>
              <div className="text-xs text-warm-gray">{p.slug} · {formatCents(p.price_cents, p.currency)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(p)} className="text-xs uppercase tracking-widest text-burgundy hover:text-burgundy-deep">Edit</button>
              <button onClick={async () => { if (confirm("Delete this package?")) { await del({ data: { id: p.id } }); qc.invalidateQueries(); } }} className="text-xs uppercase tracking-widest text-warm-gray hover:text-destructive">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {editing && <ProductEditor product={editing} onCancel={() => setEditing(null)} onSave={save} />}
    </section>
  );
}

function ProductEditor({ product, onCancel, onSave }: { product: any; onCancel: () => void; onSave: (p: any) => void }) {
  const [p, setP] = useState({
    ...product,
    items_included_text: (product.items_included ?? []).join("\n"),
    price_dollars: (product.price_cents ?? 0) / 100,
  });
  const input = "w-full bg-white border border-burgundy/15 px-4 py-2 text-sm focus:outline-none focus:border-gold";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: p.id,
      name: p.name, slug: p.slug, tagline: p.tagline ?? "", description: p.description,
      price_cents: Math.round(Number(p.price_dollars) * 100),
      currency: p.currency || "usd",
      image_url: p.image_url ?? "",
      items_included: String(p.items_included_text).split("\n").map((s: string) => s.trim()).filter(Boolean),
      is_active: !!p.is_active,
      sort_order: Number(p.sort_order) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-cream max-w-2xl w-full p-8 space-y-3 max-h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-2xl text-burgundy-deep">{p.id ? "Edit" : "New"} Package</h3>
        <input required placeholder="Name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className={input} />
        <input required placeholder="Slug (lowercase-with-dashes)" value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} className={input} />
        <input placeholder="Tagline" value={p.tagline ?? ""} onChange={(e) => setP({ ...p, tagline: e.target.value })} className={input} />
        <textarea required placeholder="Description" value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} className={`${input} min-h-[100px]`} />
        <div className="grid grid-cols-3 gap-3">
          <input required type="number" step="0.01" placeholder="Price" value={p.price_dollars} onChange={(e) => setP({ ...p, price_dollars: e.target.value })} className={input} />
          <input placeholder="Currency" value={p.currency} onChange={(e) => setP({ ...p, currency: e.target.value })} className={input} />
          <input type="number" placeholder="Sort" value={p.sort_order} onChange={(e) => setP({ ...p, sort_order: e.target.value })} className={input} />
        </div>
        <input placeholder="Image URL (optional)" value={p.image_url ?? ""} onChange={(e) => setP({ ...p, image_url: e.target.value })} className={input} />
        <textarea placeholder="Items included (one per line)" value={p.items_included_text} onChange={(e) => setP({ ...p, items_included_text: e.target.value })} className={`${input} min-h-[120px]`} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.is_active} onChange={(e) => setP({ ...p, is_active: e.target.checked })} /> Active (visible to customers)
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary">Save</button>
          <button type="button" onClick={onCancel} className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)]">Cancel</button>
        </div>
      </form>
    </div>
  );
}

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"] as const;

function OrdersManager() {
  const list = useServerFn(adminListOrders);
  const setStatus = useServerFn(updateOrderStatus);
  const qc = useQueryClient();
  const { data: orders } = useQuery({ queryKey: ["adminOrders"], queryFn: () => list() });

  return (
    <section>
      <h2 className="font-serif text-2xl text-burgundy-deep mb-6">Orders</h2>
      <div className="space-y-2">
        {orders?.length === 0 && <p className="text-warm-gray text-sm">No orders yet.</p>}
        {orders?.map((o: any) => (
          <details key={o.id} className="bg-white border-l-2 border-gold">
            <summary className="p-5 cursor-pointer flex justify-between items-center">
              <div>
                <div className="font-serif text-lg text-burgundy-deep">{o.customer_name} · {o.products?.name}</div>
                <div className="text-xs text-warm-gray">{new Date(o.created_at).toLocaleString()} · {o.customer_email}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg">{formatCents(o.amount_cents, o.currency)}</span>
                <select
                  value={o.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={async (e) => {
                    await setStatus({ data: { id: o.id, status: e.target.value as any } });
                    toast.success("Updated");
                    qc.invalidateQueries({ queryKey: ["adminOrders"] });
                  }}
                  className="text-[11px] uppercase tracking-widest border border-burgundy/20 px-2 py-1 bg-white"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </summary>
            <div className="px-5 pb-5 text-sm text-warm-gray">
              <div className="font-medium text-charcoal mb-1">Shipping</div>
              <pre className="text-xs whitespace-pre-wrap bg-cream p-3 border border-burgundy/10">{JSON.stringify(o.shipping_address, null, 2)}</pre>
              <div className="mt-2">Qty: {o.quantity} · Order ID: <span className="font-mono">{o.id}</span></div>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
