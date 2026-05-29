import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { listProducts, placeOrder } from "@/lib/products.functions";
import { supabase } from "@/integrations/supabase/client";
import { formatCents } from "@/lib/format";
import kitImg from "@/assets/photo-flatlay.webp";
import openBox from "@/assets/photo-open-box.webp";
import detail1 from "@/assets/photo-detail-1.avif";
import detail4 from "@/assets/photo-detail-4.avif";

export const Route = createFileRoute("/kit")({
  head: () => ({
    meta: [
      { title: "The Rewindd Ritual Kit — Order Yours" },
      { name: "description", content: "Hand-assembled, sealed, and shipped worldwide. Everything you need for one quiet evening together." },
      { property: "og:title", content: "The Rewindd Ritual Kit" },
      { property: "og:description", content: "One evening. Three soft acts. Come back to each other." },
    ],
  }),
  component: KitPage,
});

function KitPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });
  const product = products?.[0];

  return (
    <SiteLayout>
      <section className="pt-32 pb-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <img src={kitImg} alt="The Rewindd kit" width={1400} height={1400} className="w-full aspect-square object-cover" />
          </div>
          <div className="md:pt-8">
            <div className="eyebrow">A Single Kit. Endlessly Reusable.</div>
            {isLoading || !product ? (
              <h1 className="section-title mt-4">Loading…</h1>
            ) : (
              <>
                <h1 className="section-title mt-4">{product.name}</h1>
                <p className="mt-3 text-warm-gray italic font-serif text-xl">{product.tagline}</p>
                <div className="mt-6 font-serif text-3xl text-burgundy-deep">{formatCents(product.price_cents, product.currency)}</div>
                <p className="mt-6 text-warm-gray leading-relaxed">{product.description}</p>

                <div className="mt-8">
                  <div className="eyebrow mb-4">What's inside</div>
                  <ul className="space-y-2 text-sm text-charcoal">
                    {(product.items_included as string[]).map((it) => (
                      <li key={it} className="flex gap-3"><span className="text-gold">◆</span>{it}</li>
                    ))}
                  </ul>
                </div>

                <OrderForm
                  productId={product.id}
                  priceCents={product.price_cents}
                  currency={product.currency}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function OrderForm({ productId, priceCents, currency }: { productId: string; priceCents: number; currency: string }) {
  const navigate = useNavigate();
  const place = useServerFn(placeOrder);
  const [authChecked, setAuthChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    customerName: "", customerEmail: "", phone: "",
    line1: "", line2: "", city: "", state: "", postal_code: "", country: "United States",
    notes: "",
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.info("Please sign in to complete your order.");
        navigate({ to: "/login", search: { redirect: "/kit" } });
        return;
      }
      const res = await place({
        data: {
          productId, quantity: qty,
          customerName: form.customerName, customerEmail: form.customerEmail, phone: form.phone,
          shippingAddress: {
            line1: form.line1, line2: form.line2, city: form.city,
            state: form.state, postal_code: form.postal_code, country: form.country,
          },
          notes: form.notes,
        },
      });
      navigate({ to: "/order-success", search: { id: res.orderId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
      setAuthChecked(true);
    }
  };

  const input = "w-full bg-white border border-burgundy/15 px-4 py-3 text-sm font-sans text-charcoal focus:outline-none focus:border-gold transition";

  return (
    <form onSubmit={submit} className="mt-10 border-t border-burgundy/15 pt-8 space-y-4">
      <div className="eyebrow !text-[color:var(--color-burgundy)] mb-2">Place Your Order</div>
      <div className="flex gap-3 items-center">
        <label className="text-xs uppercase tracking-wider text-warm-gray">Quantity</label>
        <input type="number" min={1} max={10} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value))} className={`${input} !w-24`} />
        <div className="ml-auto font-serif text-2xl text-burgundy-deep">{formatCents(priceCents * qty, currency)}</div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input required placeholder="Full name" value={form.customerName} onChange={onChange("customerName")} className={input} />
        <input required type="email" placeholder="Email" value={form.customerEmail} onChange={onChange("customerEmail")} className={input} />
      </div>
      <input placeholder="Phone (optional)" value={form.phone} onChange={onChange("phone")} className={input} />
      <input required placeholder="Address line 1" value={form.line1} onChange={onChange("line1")} className={input} />
      <input placeholder="Address line 2 (optional)" value={form.line2} onChange={onChange("line2")} className={input} />
      <div className="grid md:grid-cols-3 gap-3">
        <input required placeholder="City" value={form.city} onChange={onChange("city")} className={input} />
        <input placeholder="State / Region" value={form.state} onChange={onChange("state")} className={input} />
        <input required placeholder="Postal code" value={form.postal_code} onChange={onChange("postal_code")} className={input} />
      </div>
      <input required placeholder="Country" value={form.country} onChange={onChange("country")} className={input} />
      <textarea placeholder="Anything we should know? (optional)" value={form.notes} onChange={onChange("notes")} className={`${input} min-h-[80px]`} />
      <button type="submit" disabled={submitting} className="btn-primary w-full mt-2 disabled:opacity-60">
        {submitting ? "Placing order…" : "Complete Order"}
      </button>
      <p className="text-[11px] text-warm-gray text-center">
        You'll receive payment instructions by email. Payments are processed manually for now.
      </p>
    </form>
  );
}
