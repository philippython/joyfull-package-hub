import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { getProductBySlug, placeOrder } from "@/lib/products.functions";
import { formatCents } from "@/lib/format";
import OrderForm from "@/components/order-form";
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

function normalizeImageUrl(url: string) {
  if (!url) return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^data:/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  // Treat bare filenames as assets in /assets/
  return `/assets/${trimmed}`;
}

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
    ? (product.image_urls as string[])
        .filter((url) => typeof url === "string" && url.trim())
        .map(normalizeImageUrl)
    : [];
  const productImages = imageUrls.length
    ? imageUrls.slice(0, 10)
    : product.image_url
      ? [normalizeImageUrl(product.image_url), ...galleryImages]
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
              <a
                id="buy-now-cta"
                href={`/checkout?slug=${product.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/checkout?slug=${product.slug}`;
                }}
                className="btn-outline inline-flex items-center text-lg font-semibold px-4 py-2"
              >
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
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
  }, [api]);

  // If embla/api hasn't initialized after a short delay, enable simple fallback
  useEffect(() => {
    const t = setTimeout(() => {
      if (!api) setUseFallback(true);
    }, 400);
    return () => clearTimeout(t);
  }, [api]);

  if (useFallback || !Carousel) {
    return (
      <div className="space-y-3">
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-white">
            <img
              src={images[fallbackIndex]}
              alt={`Product photo ${fallbackIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            aria-label="Previous"
            onClick={() => setFallbackIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-cream p-2 rounded-full"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => setFallbackIndex((i) => (i + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-cream p-2 rounded-full"
          >
            ›
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setFallbackIndex(i)}
              className={`min-w-[5rem] aspect-square overflow-hidden border-2 transition ${fallbackIndex === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    );
  }

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
