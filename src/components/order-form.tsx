import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { createCheckoutSession } from "@/lib/payments.functions";
import { createPayPalOrder } from "@/lib/paypal.functions";
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
  const checkout = useServerFn(createCheckoutSession);
  const paypal = useServerFn(createPayPalOrder);
  const [submitting, setSubmitting] = useState<null | "stripe" | "paypal">(null);

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

  const payload = () => ({
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
  });

  const validateForm = () => {
    const f = form;
    if (!f.customerName || !f.customerEmail || !f.line1 || !f.city || !f.postal_code || !f.country) {
      toast.error("Please complete all required fields.");
      return false;
    }
    return true;
  };

  const pay = async (provider: "stripe" | "paypal") => {
    if (!validateForm()) return;
    setSubmitting(provider);
    try {
      const fn = provider === "stripe" ? checkout : paypal;
      const res = await fn({ data: payload() });
      if (onComplete) onComplete(res.orderId);
      if (res?.url) {
        window.location.href = res.url;
        return;
      }
      navigate({ to: "/order-success", search: { id: res.orderId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(null);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    pay("stripe");
  };


  const input =
    "w-full bg-white border border-burgundy/15 px-4 py-3 text-sm font-sans text-charcoal focus:outline-none focus:border-gold transition";

  return (
    <form onSubmit={submit} className="space-y-4">
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
      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={submitting !== null}
          className="btn-primary w-full disabled:opacity-60"
        >
          {submitting === "stripe" ? "Redirecting to Stripe…" : "Pay with Card (Stripe)"}
        </button>
        <button
          type="button"
          onClick={() => pay("paypal")}
          disabled={submitting !== null}
          className="w-full px-6 py-3 text-sm font-semibold tracking-wide bg-[#ffc439] text-[#003087] hover:bg-[#f5b800] transition disabled:opacity-60"
        >
          {submitting === "paypal" ? "Redirecting to PayPal…" : "Pay with PayPal"}
        </button>
        <p className="text-[11px] text-warm-gray text-center pt-2">
          Secure checkout — your payment details never touch our servers.
        </p>
      </div>
    </form>
  );
}
