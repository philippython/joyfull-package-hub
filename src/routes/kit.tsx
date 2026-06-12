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
      { title: "Date Night Kits — Rewindd" },
      {
        name: "description",
        content:
          "Choose your Rewindd date night kit. Hand-packed, UK delivery, dispatched in 2–3 business days.",
      },
      { property: "og:title", content: "Rewindd — Date Night Kits" },
      {
        property: "og:description",
        content: "Browse our intentional, hand-packed date night kits for couples.",
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
      <section className="bg-charcoal text-cream pt-36 pb-20 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-5">Our Kits</div>
        <h1 className="font-serif font-light text-[clamp(36px,6vw,64px)] leading-[1.1] max-w-3xl mx-auto">
          Choose your <em>evening together.</em>
        </h1>
        <p className="mt-6 text-cream/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Every kit is hand-packed and designed to help busy couples slow down and reconnect — all
          from the comfort of home.
        </p>
      </section>

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
                return (
                  <div
                    key={p.id}
                    className="group flex flex-col bg-white border border-burgundy/10 hover:border-gold transition-colors"
                  >
                    <KitCarousel images={images} slug={p.slug} name={p.name} />
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="font-serif text-xl text-burgundy-deep">{p.name}</div>
                      {p.tagline && <p className="text-sm text-warm-gray mt-1">{p.tagline}</p>}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-serif text-2xl text-burgundy-deep">
                          {formatCents(p.price_cents, p.currency)}
                        </span>
                      </div>
                      <a
                        href={`/checkout?slug=${p.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/checkout?slug=${p.slug}`;
                        }}
                        className="btn-primary text-center mt-5"
                      >
                        Order Now
                      </a>
                    </div>



                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
