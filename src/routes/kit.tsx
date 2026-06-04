import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { listProducts, placeOrder } from "@/lib/products.functions";
import { formatCents } from "@/lib/format";
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import flatlay from "@/assets/photo-flatlay.webp";
import openBox from "@/assets/photo-open-box.webp";
import boxImg from "@/assets/photo-box.jpg";
import cardImg from "@/assets/photo-card.jpg";
import coupleCards from "@/assets/photo-couple-cards.webp";
import coupleMask from "@/assets/photo-couple-mask.jpg";
import detail1 from "@/assets/photo-detail-1.avif";
import detail2 from "@/assets/photo-detail-2.avif";
import detail3 from "@/assets/photo-detail-3.avif";
import detail4 from "@/assets/photo-detail-4.avif";

const productImages = [flatlay, openBox, cardImg, detail1, detail2, detail3, boxImg, coupleCards, coupleMask, detail4];

const includedItems = [
  "30 conversation cards designed to spark meaningful connection",
  "Vanilla candle to help you slow down and set the mood for your evening",
  "Curated Spotify playlist to help set the mood for your evening",
  "Massage oil for a moment of closeness and intentional touch",
  "Satin eye mask for the closing reflection ritual",
  "Date Night Ritual Guide to lead you through the experience",
  "Premium gift box designed to be kept and reused",
];

const faqs = [
  { q: "Who is this kit for?", a: "Couples who still love each other but want to be more intentional about spending quality time together." },
  { q: "How long does the evening take?", a: "Around ninety minutes to two hours — but there's no clock. Move at the pace that feels right for you." },
  { q: "Do you ship outside the UK?", a: "Not yet. Rewindd is currently available for delivery within the United Kingdom only." },
  { q: "Can I gift it?", a: "Yes — every kit ships in premium gift-ready packaging." },
  { q: "How long until it arrives?", a: "Dispatched within 2–3 business days. Tracking is sent as soon as your order is on its way." },
];

export const Route = createFileRoute("/kit")({
  head: () => ({
    meta: [
      { title: "Date Night Box for Couples UK | Rewindd Date Night Kit" },
      { name: "description", content: "A romantic at-home date night kit for busy couples. Conversation cards, candle, massage oil, eye mask and ritual guide. £40, UK delivery only." },
      { property: "og:title", content: "Date Night Box for Couples UK | Rewindd" },
      { property: "og:description", content: "A romantic at-home experience designed to help busy couples reconnect." },
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
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <SiteLayout>
      {/* PRODUCT */}
      <section className="pt-32 pb-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <ProductCarousel images={productImages} />

          <div className="md:pt-4">
            <div className="eyebrow">One Kit. More Time Together.</div>
            {isLoading || !product ? (
              <h1 className="section-title mt-4">Loading…</h1>
            ) : (
              <>
                <h1 className="font-serif font-light text-[clamp(32px,4.5vw,48px)] leading-[1.1] text-charcoal mt-4">
                  Date Night Box for Couples UK
                  <span className="block text-burgundy italic text-[0.7em] mt-2">| Rewindd Date Night Kit</span>
                </h1>
                <p className="mt-4 font-serif italic text-xl text-warm-gray">
                  A romantic at-home experience designed to help busy couples reconnect.
                </p>

                <div className="mt-6 font-serif text-4xl text-burgundy-deep">{formatCents(product.price_cents, product.currency)}</div>

                <ul className="mt-5 space-y-1.5 text-sm text-charcoal list-none">
                  <li className="flex gap-2"><span className="text-gold">✓</span> UK Delivery Only</li>
                  <li className="flex gap-2"><span className="text-gold">✓</span> Dispatched in 2–3 Business Days</li>
                  <li className="flex gap-2"><span className="text-gold">✓</span> Gift-Ready Packaging</li>
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => setCheckoutOpen(true)} className="btn-primary">Add to Cart</button>
                  <a href="#checkout" onClick={() => setCheckoutOpen(true)} className="btn-outline">Buy Now</a>
                </div>

                <div className="mt-10 space-y-4 text-warm-gray leading-relaxed text-[15px]">
                  <p className="font-serif italic text-lg text-charcoal">Still love each other, but struggling to find time for each other?</p>
                  <p>You're not alone.</p>
                  <p>Between work, children, responsibilities and everyday life, quality time often becomes the thing couples keep postponing.</p>
                  <p>Rewindd is a date night box designed to help couples reconnect from the comfort of home.</p>
                  <p>No babysitter. No restaurant booking. No complicated planning.</p>
                  <p>Just one intentional evening filled with meaningful conversation, connection and quality time together.</p>
                  <p className="font-serif italic text-lg text-burgundy">Light the candle. Open the cards. Put your phones away.</p>
                  <p>This is your invitation to find each other again.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* INSIDE THE KIT */}
      {product && (
        <section className="bg-[color:var(--color-burgundy-deep)] text-cream px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="eyebrow !text-[color:var(--color-gold)] justify-center">Inside Your Rewindd Kit</div>
              <h2 className="section-title !text-cream mt-4">Everything arrives <em>beautifully packaged.</em></h2>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
              <img src={openBox} alt="Open Rewindd kit" className="w-full aspect-[4/5] object-cover" />
              <ul className="space-y-4 list-none">
                {includedItems.map((it) => (
                  <li key={it} className="flex gap-3 text-cream/80 text-[15px] leading-relaxed border-b border-gold/15 pb-4">
                    <span className="text-gold mt-0.5">◆</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* FOUNDER STORY (brief) */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow justify-center">Our Story</div>
          <h2 className="section-title mt-4">The love was still there.<br/><em>Life just got busy.</em></h2>
          <div className="mt-8 space-y-3 text-warm-gray leading-relaxed">
            <p>Nobody really talks about marriages where nothing is wrong.</p>
            <p>You still love each other. You still care. You still show up.</p>
            <p>But somewhere between work, children and responsibilities, quality time together quietly disappears.</p>
            <p className="font-serif italic text-lg text-burgundy">Rewindd is our invitation back.</p>
          </div>
          <a href="/#story" className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)] mt-8 inline-flex hover:!bg-[color:var(--color-burgundy)] hover:!text-cream">Read the full story</a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-ivory">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="eyebrow justify-center">FAQs</div>
            <h2 className="section-title mt-4">Things people <em>ask us.</em></h2>
          </div>
          <div className="mt-10">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* CHECKOUT */}
      <section id="checkout" className="py-24 px-6 bg-cream border-t border-burgundy/10">
        <div className="max-w-2xl mx-auto">
          {!checkoutOpen ? (
            <div className="text-center">
              <h2 className="section-title">Ready to <em>order?</em></h2>
              <button onClick={() => setCheckoutOpen(true)} className="btn-primary mt-8">Add to Cart</button>
            </div>
          ) : product ? (
            <OrderForm productId={product.id} priceCents={product.price_cents} currency={product.currency} />
          ) : null}
        </div>
      </section>
    </SiteLayout>
  );
}

function ProductCarousel({ images }: { images: string[] }) {
  const [api, setApi] = useState<any>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
  }, [api]);

  return (
    <div className="space-y-3">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={i}>
              <div className="aspect-square overflow-hidden bg-white">
                <img src={src} alt={`Rewindd product photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
      <div className="grid grid-cols-5 gap-2">
        {images.slice(0, 5).map((src, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`aspect-square overflow-hidden border-2 transition ${selected === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderForm({ productId, priceCents, currency }: { productId: string; priceCents: number; currency: string }) {
  const navigate = useNavigate();
  const place = useServerFn(placeOrder);
  const [submitting, setSubmitting] = useState(false);
  const [qty, setQty] = useState(1);
  const [form, setForm] = useState({
    customerName: "", customerEmail: "", phone: "",
    line1: "", line2: "", city: "", state: "", postal_code: "", country: "United Kingdom",
    notes: "",
  });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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
    }
  };

  const input = "w-full bg-white border border-burgundy/15 px-4 py-3 text-sm font-sans text-charcoal focus:outline-none focus:border-gold transition";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="eyebrow !text-[color:var(--color-burgundy)] mb-2 justify-center">Place Your Order</div>
      <h2 className="section-title text-center mb-8">Complete your <em>checkout.</em></h2>
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
        <input placeholder="County (optional)" value={form.state} onChange={onChange("state")} className={input} />
        <input required placeholder="Postcode" value={form.postal_code} onChange={onChange("postal_code")} className={input} />
      </div>
      <input required placeholder="Country" value={form.country} onChange={onChange("country")} className={input} />
      <textarea placeholder="Anything we should know? (optional)" value={form.notes} onChange={onChange("notes")} className={`${input} min-h-[80px]`} />
      <button type="submit" disabled={submitting} className="btn-primary w-full mt-2 disabled:opacity-60">
        {submitting ? "Placing order…" : "Complete Order"}
      </button>
      <p className="text-[11px] text-warm-gray text-center">
        UK delivery only · Dispatched in 2–3 business days · Payment instructions will be emailed.
      </p>
    </form>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-burgundy/15">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left font-serif text-lg text-burgundy-deep hover:text-burgundy transition">
        {q}
        <span className={`text-gold text-xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="pb-5 text-sm text-warm-gray leading-relaxed">{a}</p>}
    </div>
  );
}
