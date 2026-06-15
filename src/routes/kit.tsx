import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { listProducts } from "@/lib/products.functions";
import { formatCents } from "@/lib/format";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import flatlay from "@/assets/photo-flatlay.webp";

const FALLBACK_IMG = flatlay;

const TRUST_SIGNALS = [
  "UK Delivery Only",
  "Dispatched in 2–3 Business Days",
  "Gift-Ready Packaging",
];

function normalizeImageUrl(url: string) {
  if (!url) return url;
  const trimmed = String(url).trim();
  if (!trimmed) return trimmed;
  if (/^data:/i.test(trimmed)) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/assets/${trimmed}`;
}

export const Route = createFileRoute("/kit")({
  head: () => ({
    meta: [
      { title: "Date Night Box for Couples UK | Rewindd Date Night Kit" },
      {
        name: "description",
        content:
          "A romantic at-home experience designed to help busy couples reconnect. Hand-packed, UK delivery, dispatched in 2–3 business days.",
      },
      { property: "og:title", content: "Rewindd — Date Night Box for Couples UK" },
      {
        property: "og:description",
        content: "No babysitter. No restaurant booking. Just one intentional evening to reconnect.",
      },
    ],
  }),
  component: KitListPage,
});

function KitListPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => listProducts(),
  });

  return (
    <SiteLayout>
      {/* ── Hero ── */}
      <section className="bg-charcoal text-cream pt-36 pb-20 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-5">
          Date Night Box for Couples UK
        </div>
        <h1 className="font-serif font-light text-[clamp(36px,6vw,64px)] leading-[1.1] max-w-3xl mx-auto">
          A romantic at-home experience designed to help busy couples <em>reconnect.</em>
        </h1>
        <p className="mt-6 text-cream/70 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Still love each other, but struggling to find time for each other? Rewindd is a date night
          box designed to help couples reconnect from the comfort of home. No babysitter. No
          restaurant booking. No complicated planning.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {TRUST_SIGNALS.map((t) => (
            <span
              key={t}
              className="flex items-center gap-2 text-xs text-cream/60 uppercase tracking-wider"
            >
              <span className="text-gold">✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── Kit grid ── */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <p className="text-center text-warm-gray">Loading kits…</p>
          ) : !products?.length ? (
            <p className="text-center text-warm-gray">
              No kits available right now. Please check back soon.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p: any) => {
                const urls: string[] = Array.isArray(p.image_urls)
                  ? p.image_urls.filter((u: any) => typeof u === "string" && u.trim())
                  : [];
                const fromDb = urls.length
                  ? urls.map(normalizeImageUrl)
                  : typeof p.image_url === "string" && p.image_url.trim()
                    ? [normalizeImageUrl(p.image_url)]
                    : [];
                const images = fromDb.length ? fromDb : [FALLBACK_IMG];

                // items_included from DB
                const items: string[] = Array.isArray(p.items_included)
                  ? (p.items_included as string[]).filter(Boolean).slice(0, 7)
                  : [];

                return (
                  <div
                    key={p.id}
                    className="group flex flex-col bg-white border border-burgundy/10 hover:border-gold transition-colors"
                  >
                    <KitCarousel images={images} slug={p.slug} name={p.name} />

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Name from DB */}
                      <div className="font-serif text-xl text-burgundy-deep leading-snug">
                        {p.name}
                      </div>

                      {/* Tagline from DB */}
                      {p.tagline && (
                        <p className="text-sm text-warm-gray mt-1 leading-snug">{p.tagline}</p>
                      )}

                      {/* Items from DB */}
                      {items.length > 0 && (
                        <ul className="mt-4 space-y-1">
                          {items.map((item: string) => (
                            <li key={item} className="flex gap-2 text-xs text-charcoal/70">
                              <span className="text-gold shrink-0">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Price from DB */}
                      <div className="mt-5 flex items-baseline gap-2">
                        <span className="font-serif text-2xl text-burgundy-deep">
                          {formatCents(p.price_cents, p.currency)}
                        </span>
                        <span className="text-xs text-warm-gray">incl. gift packaging</span>
                      </div>

                      {/* Trust signals */}
                      <div className="mt-3 space-y-1">
                        {TRUST_SIGNALS.map((t) => (
                          <p key={t} className="text-[11px] text-warm-gray flex gap-1.5">
                            <span className="text-gold">✓</span> {t}
                          </p>
                        ))}
                      </div>

                      {/* CTA */}
                      <a
                        href={`/checkout?slug=${p.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/checkout?slug=${p.slug}`;
                        }}
                        className="btn-primary text-center mt-6"
                      >
                        Order Now — {formatCents(p.price_cents, p.currency)}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Rewindd ── */}
      <section className="bg-charcoal text-cream py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-5">
            Why Rewindd
          </div>
          <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-[1.2] mb-8">
            Light the candle. Open the cards. <em>Put your phones away.</em>
          </h2>
          <p className="text-cream/70 text-sm md:text-base leading-relaxed mb-12">
            This is your invitation to find each other again. Everything arrives beautifully
            packaged and ready to enjoy — no preparation needed.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            {[
              {
                heading: "No babysitter needed",
                body: "A full date night experience from your own sofa. Just open the box.",
              },
              {
                heading: "Meaningful, not generic",
                body: "Every item is chosen to slow you down and spark real conversation.",
              },
              {
                heading: "Ready to gift",
                body: "Premium box designed to be kept. Perfect as a gift or a treat for yourselves.",
              },
            ].map((c) => (
              <div key={c.heading}>
                <div className="text-gold font-serif text-lg mb-2">{c.heading}</div>
                <p className="text-cream/60 text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function KitCarousel({ images, slug, name }: { images: string[]; slug: string; name: string }) {
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || images.length < 2) return;
    const t = setInterval(() => api.scrollNext(), 4500);
    return () => clearInterval(t);
  }, [api, images.length]);

  return (
    <div className="relative">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={i}>
              <a
                href={`/kit/${slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/kit/${slug}`;
                }}
                aria-label={`View ${name}`}
                className="block w-full aspect-[4/5] overflow-hidden bg-cream"
              >
                <img
                  src={src}
                  alt={`${name} — photo ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        )}
      </Carousel>
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                selected === i ? "w-6 bg-gold" : "w-1.5 bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
