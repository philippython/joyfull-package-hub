import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { SiteLayout } from "@/components/site-layout";
import { getProductBySlug, createPaymentIntent, createPayPalOrder } from "@/lib/api";
import { formatCents } from "@/lib/format";
import flatlay from "@/assets/photo-flatlay.webp";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const input =
  "w-full bg-white border border-burgundy/15 px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/60 focus:outline-none focus:border-gold transition";

// ── Stripe payment form ───────────────────────────────────────────────────────
function StripeForm({ orderId, onSuccess }: { orderId: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order-success?id=${orderId}` },
    });
    if (error) {
      toast.error(error.message || "Payment failed");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={busy || !stripe}
        className="btn-primary w-full mt-4 disabled:opacity-60"
      >
        {busy ? "Processing…" : "Pay Now"}
      </button>
    </form>
  );
}

// ── Main checkout ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const slug = params.get("slug") || "";

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });

  const [step, setStep] = useState<"details" | "stripe" | "processing">("details");
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [qty, setQty] = useState(1);
  const [paypalBusy, setPaypalBusy] = useState(false);

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

  const validate = () => {
    if (
      !form.customerName ||
      !form.customerEmail ||
      !form.line1 ||
      !form.city ||
      !form.postal_code
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const payload = () => ({
    productId: product!.id,
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

  const handleStripe = async () => {
    if (!validate()) return;
    setStep("processing");
    try {
      const res = await createPaymentIntent(payload());
      setClientSecret(res.clientSecret);
      setOrderId(res.orderId);
      setStep("stripe");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start payment");
      setStep("details");
    }
  };

  const handlePayPal = async () => {
    if (!validate()) return;
    setPaypalBusy(true);
    try {
      const res = await createPayPalOrder(payload());
      window.location.href = res.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "PayPal failed");
      setPaypalBusy(false);
    }
  };

  if (isLoading)
    return (
      <SiteLayout>
        <div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div>
      </SiteLayout>
    );
  if (!product)
    return (
      <SiteLayout>
        <div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">
          Kit not found.{" "}
          <Link to="/kit" className="underline">
            Browse kits
          </Link>
        </div>
      </SiteLayout>
    );

  const img =
    Array.isArray(product.image_urls) && product.image_urls[0]
      ? product.image_urls[0]
      : product.image_url || flatlay;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-cream pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          {/* Kit summary */}
          <div className="flex gap-4 items-center bg-white border border-burgundy/10 p-4 mb-6">
            <img src={img} alt={product.name} className="w-20 h-20 object-cover shrink-0" />
            <div className="min-w-0">
              <div className="font-serif text-lg text-burgundy-deep leading-snug">
                {product.name}
              </div>
              <div className="font-serif text-xl text-burgundy mt-1">
                {formatCents(product.price_cents * qty, product.currency)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <label className="text-xs text-warm-gray uppercase tracking-wider">Qty</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Math.min(10, +e.target.value)))}
                  className="w-14 border border-burgundy/15 px-2 py-1 text-sm text-center focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {step === "processing" && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-warm-gray text-sm">Setting up payment…</p>
            </div>
          )}

          {step === "stripe" && clientSecret && (
            <div className="bg-white border border-burgundy/10 p-6">
              <h2 className="font-serif text-xl text-burgundy-deep mb-5">Card Payment</h2>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: { colorPrimary: "#5c1a1a", fontFamily: "Jost, sans-serif" },
                  },
                }}
              >
                <StripeForm
                  orderId={orderId}
                  onSuccess={() => navigate(`/order-success?id=${orderId}`)}
                />
              </Elements>
              <button
                onClick={() => setStep("details")}
                className="mt-4 text-xs text-warm-gray hover:text-burgundy uppercase tracking-wider"
              >
                ← Back
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-3">
              <h2 className="font-serif text-2xl text-burgundy-deep">Your details</h2>

              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Full name *"
                  value={form.customerName}
                  onChange={onChange("customerName")}
                  className={input}
                />
                <input
                  required
                  type="email"
                  placeholder="Email *"
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

              <p className="text-xs uppercase tracking-wider text-warm-gray pt-1">
                Shipping address
              </p>
              <input
                required
                placeholder="Address line 1 *"
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
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="City *"
                  value={form.city}
                  onChange={onChange("city")}
                  className={input}
                />
                <input
                  required
                  placeholder="Postcode *"
                  value={form.postal_code}
                  onChange={onChange("postal_code")}
                  className={input}
                />
              </div>
              <input
                placeholder="County (optional)"
                value={form.state}
                onChange={onChange("state")}
                className={input}
              />
              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={onChange("notes")}
                className={`${input} min-h-[60px] resize-none`}
              />

              <div className="space-y-3 pt-2">
                <button onClick={handleStripe} className="btn-primary w-full">
                  Pay with Card — {formatCents(product.price_cents * qty, product.currency)}
                </button>
                <button
                  onClick={handlePayPal}
                  disabled={paypalBusy}
                  className="w-full px-6 py-3.5 text-sm font-semibold bg-[#ffc439] text-[#003087] hover:bg-[#f5b800] transition disabled:opacity-60"
                >
                  {paypalBusy ? "Redirecting…" : "Pay with PayPal"}
                </button>
                <p className="text-[11px] text-warm-gray text-center">
                  Secure checkout · UK delivery only
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
