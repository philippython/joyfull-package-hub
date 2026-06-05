import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { getProductBySlug, placeOrder } from "@/lib/products.functions";
import { formatCents } from "@/lib/format";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
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

const galleryImages = [
  flatlay,
  openBox,
  cardImg,
  detail1,
  detail2,
  detail3,
  boxImg,
  coupleCards,
  coupleMask,
  detail4,
];

export const Route = createFileRoute("/kit/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Rewindd` },
      {
        name: "description",
        content:
          "A romantic at-home date night kit for busy couples in the UK. Hand-packed, UK delivery, dispatched in 2–3 business days.",
      },
    ],
  }),
  component: KitDetail,
});

function KitDetail() {
  const { slug } = Route.useParams();
  const get = useServerFn(getProductBySlug);
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => get({ data: { slug } }),
  });
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div>
      </SiteLayout>
    );
  }
  if (!product) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] pt-32 px-6 text-center">
          <h1 className="font-serif text-3xl text-burgundy-deep">Kit not found</h1>
          <Link to="/kit" className="btn-primary mt-6 inline-block">
            Browse Kits
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const items = (product.items_included as string[] | null) ?? [];
  const imageUrls = Array.isArray(product.image_urls)
    ? (product.image_urls as string[]).filter((url) => typeof url === "string" && url.trim())
    : [];
  const productImages = imageUrls.length
    ? imageUrls.slice(0, 10)
    : product.image_url
      ? [product.image_url, ...galleryImages]
      : galleryImages;

  return (
    <SiteLayout>
      <section className="pt-32 pb-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <ProductCarousel images={productImages} />

          <div className="md:pt-4">
            <div className="eyebrow">{product.tagline || "Date Night Kit"}</div>
            <h1 className="font-serif font-light text-[clamp(32px,4.5vw,48px)] leading-[1.1] text-charcoal mt-4">
              {product.name}
            </h1>

            <div className="mt-6 font-serif text-4xl text-burgundy-deep">
              {formatCents(product.price_cents, product.currency)}
            </div>

            <ul className="mt-5 space-y-1.5 text-sm text-charcoal list-none">
              <li className="flex gap-2">
                <span className="text-gold">✓</span> UK Delivery Only
              </li>
              <li className="flex gap-2">
                <span className="text-gold">✓</span> Dispatched in 2–3 Business Days
              </li>
              <li className="flex gap-2">
                <span className="text-gold">✓</span> Gift-Ready Packaging
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setCheckoutOpen(true)} className="btn-primary">
                Add to Cart
              </button>
              <a href="#checkout" onClick={() => setCheckoutOpen(true)} className="btn-outline">
                Buy Now
              </a>
            </div>

            <div className="mt-10 space-y-4 text-warm-gray leading-relaxed text-[15px] whitespace-pre-line">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      {items.length > 0 && (
        <section className="bg-[color:var(--color-burgundy-deep)] text-cream px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="eyebrow !text-[color:var(--color-gold)] justify-center">
                Inside Your Kit
              </div>
              <h2 className="section-title !text-cream mt-4">
                Everything arrives <em>beautifully packaged.</em>
              </h2>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
              <img
                src={openBox}
                alt="Open Rewindd kit"
                className="w-full aspect-[4/5] object-cover"
              />
              <ul className="space-y-4 list-none">
                {items.map((it) => (
                  <li
                    key={it}
                    className="flex gap-3 text-cream/80 text-[15px] leading-relaxed border-b border-gold/15 pb-4"
                  >
                    <span className="text-gold mt-0.5">◆</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section id="checkout" className="py-24 px-6 bg-cream border-t border-burgundy/10">
        <div className="max-w-2xl mx-auto">
          {!checkoutOpen ? (
            <div className="text-center">
              <h2 className="section-title">
                Ready to <em>order?</em>
              </h2>
              <button onClick={() => setCheckoutOpen(true)} className="btn-primary mt-8">
                Add to Cart
              </button>
            </div>
          ) : (
            <OrderForm
              productId={product.id}
              priceCents={product.price_cents}
              currency={product.currency}
            />
          )}
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
                <img
                  src={src}
                  alt={`Product photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={`min-w-[5rem] aspect-square overflow-hidden border-2 transition ${selected === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderForm({
  productId,
  priceCents,
  currency,
}: {
  productId: string;
  priceCents: number;
  currency: string;
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
