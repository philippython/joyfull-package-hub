import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { placeOrder } from "@/lib/products.functions";
import { formatCents } from "@/lib/format";

export default function ({
  productId,
  priceCents,
  currency,
  onComplete,
}: {
  productId: string;
  priceCents: number;
  currency: string;
  onComplete?: (orderId: string) => void;
}) {
  const navigate = useNavigate();
  const place = useServerFn(placeOrder);
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United Kingdom",
    notes: "",
  });

  const onChange =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await place({
        data: {
          productId,
          quantity: qty,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          phone: form.phone,
          shippingAddress: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            country: form.country,
          },
          notes: form.notes,
        },
      });
      if (onComplete) onComplete(res.orderId);
      navigate({ to: "/order-success", search: { id: res.orderId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "w-full bg-white border border-burgundy/15 px-4 py-3 text-sm font-sans text-charcoal focus:outline-none focus:border-gold transition";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="eyebrow !text-[color:var(--color-burgundy)] mb-2 justify-center">
        Place Your Order
      </div>
      <h2 className="section-title text-center mb-8">
        Complete your <em>checkout.</em>
      </h2>
      <div className="flex gap-3 items-center">
        <label className="text-xs uppercase tracking-wider text-warm-gray">Quantity</label>
        <input
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => setQty(Math.max(1, +e.target.value))}
          className={`${input} !w-24`}
        />
        <div className="ml-auto font-serif text-2xl text-burgundy-deep">
          {formatCents(priceCents * qty, currency)}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <input
          required
          placeholder="Full name"
          value={form.customerName}
          onChange={onChange("customerName")}
          className={input}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.customerEmail}
          onChange={onChange("customerEmail")}
          className={input}
        />
      </div>
      <input
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={onChange("phone")}
        className={input}
      />
      <input
        required
        placeholder="Address line 1"
        value={form.line1}
        onChange={onChange("line1")}
        className={input}
      />
      <input
        placeholder="Address line 2 (optional)"
        value={form.line2}
        onChange={onChange("line2")}
        className={input}
      />
      <div className="grid md:grid-cols-3 gap-3">
        <input
          required
          placeholder="City"
          value={form.city}
          onChange={onChange("city")}
          className={input}
        />
        <input
          placeholder="County (optional)"
          value={form.state}
          onChange={onChange("state")}
          className={input}
        />
        <input
          required
          placeholder="Postcode"
          value={form.postal_code}
          onChange={onChange("postal_code")}
          className={input}
        />
      </div>
      <input
        required
        placeholder="Country"
        value={form.country}
        onChange={onChange("country")}
        className={input}
      />
      <textarea
        placeholder="Anything we should know? (optional)"
        value={form.notes}
        onChange={onChange("notes")}
        className={`${input} min-h-[80px]`}
      />
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full mt-2 disabled:opacity-60"
      >
        {submitting ? "Placing order…" : "Complete Order"}
      </button>
      <p className="text-[11px] text-warm-gray text-center">
        UK delivery only · Dispatched in 2–3 business days · Payment instructions will be emailed
        (Stripe checkout coming soon).
      </p>
    </form>
  );
}
