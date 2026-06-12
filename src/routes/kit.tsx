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
                const primary =
                  urls[0] ||
                  (typeof p.image_url === "string" && p.image_url.trim() ? p.image_url : null);
                const imageSrc = (primary && normalizeImageUrl(primary)) || FALLBACK_IMG;
                const thumbs = urls.slice(1, 5).map(normalizeImageUrl);
                return (
                  <div
                    key={p.id}
                    className="group flex flex-col bg-white border border-burgundy/10 hover:border-gold transition-colors"
                  >
                    <a
                      href={`/kit/${p.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/kit/${p.slug}`;
                      }}
                      className="block relative"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-cream">
                        <img
                          src={imageSrc}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      {urls.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-cream text-xs px-2 py-1 rounded">
                          {urls.length} photos
                        </div>
                      )}
                    </a>
                    {thumbs.length > 0 && (
                      <div className="flex gap-2 px-4 pt-4">
                        {thumbs.map((t, i) => (
                          <a
                            key={i}
                            href={`/kit/${p.slug}`}
                            onClick={(e) => {
                              e.preventDefault();
                              window.location.href = `/kit/${p.slug}`;
                            }}
                            className="w-14 h-14 overflow-hidden border border-burgundy/10 hover:border-gold"
                          >
                            <img src={t} alt="" className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
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
