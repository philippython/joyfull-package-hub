import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { getProductBySlug } from "@/lib/products.functions";
import OrderForm from "@/components/order-form";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => z.object({ slug: z.string().min(1) }).parse(s),
  head: () => ({
    meta: [
      { title: "Checkout — Rewindd" },
      {
        name: "description",
        content:
          "Order your Rewindd date night kit. Secure checkout via Stripe or PayPal. UK delivery only.",
      },
    ],
  }),
  component: Checkout,
});

const TRUST = [
  { icon: "✓", label: "UK Delivery Only" },
  { icon: "✓", label: "Dispatched in 2–3 Business Days" },
  { icon: "✓", label: "Gift-Ready Packaging" },
];

function Checkout() {
  const { slug } = Route.useSearch();
  const get = useServerFn(getProductBySlug);
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => get({ data: { slug } }),
  });

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
        <div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">
          Kit not found.{" "}
          <Link to="/kit" className="underline text-burgundy-deep">
            Browse kits
          </Link>
        </div>
      </SiteLayout>
    );
  }

  // items_included comes from DB as JSONB array
  const items: string[] = Array.isArray(product.items_included)
    ? (product.items_included as string[]).filter(Boolean)
    : [];

  // description may have \n line breaks — split into paragraphs
  const paragraphs: string[] = (product.description ?? "")
    .split(/\n{2,}/)
    .map((s: string) => s.replace(/\n/g, " ").trim())
    .filter(Boolean);

  return (
    <SiteLayout>
      {/* ── Hero ── */}
      <section className="bg-charcoal text-cream pt-36 pb-16 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-4">
          Date Night Box for Couples UK
        </div>
        <h1 className="font-serif font-light text-[clamp(30px,5vw,54px)] leading-[1.15] max-w-3xl mx-auto">
          {product.tagline ? (
            <>
              {product.tagline.split("reconnect").map((part: string, i: number) =>
                i === 0 ? (
                  <span key={i}>
                    {part}
                    {i === 0 && <em>reconnect.</em>}
                  </span>
                ) : null,
              )}
            </>
          ) : (
            <>
              A romantic at-home experience designed to help busy couples <em>reconnect.</em>
            </>
          )}
        </h1>
      </section>

      {/* ── Two-column layout ── */}
      <section className="bg-cream py-16 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — product detail from DB */}
          <div>
            {/* Price + trust */}
            <div className="bg-burgundy-deep text-cream px-6 py-5 mb-8">
              <div className="font-serif text-4xl mb-1">
                {new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: product.currency?.toUpperCase() ?? "GBP",
                  minimumFractionDigits: 0,
                }).format((product.price_cents ?? 0) / 100)}
              </div>
              <div className="space-y-1 mt-3">
                {TRUST.map((t) => (
                  <p key={t.label} className="text-sm text-cream/80 flex gap-2">
                    <span className="text-gold font-semibold">{t.icon}</span>
                    {t.label}
                  </p>
                ))}
              </div>
            </div>

            {/* Description paragraphs from DB */}
            {paragraphs.length > 0 && (
              <div className="space-y-3 mb-8">
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`text-sm leading-relaxed ${
                      i === paragraphs.length - 1
                        ? "italic text-burgundy-deep font-serif text-base"
                        : "text-charcoal/80"
                    }`}
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Items included from DB */}
            {items.length > 0 && (
              <div>
                <h2 className="text-xs uppercase tracking-widest text-burgundy-deep mb-4">
                  Inside Your Rewindd Kit
                </h2>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-charcoal/80">
                      <span className="text-gold mt-0.5 shrink-0">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-warm-gray italic">
                  Everything arrives beautifully packaged and ready to enjoy.
                </p>
              </div>
            )}
          </div>

          {/* Right — checkout form */}
          <div className="bg-white border border-burgundy/10 p-8">
            <OrderForm
              productId={product.id}
              priceCents={product.price_cents}
              currency={product.currency}
            />
            <div className="mt-6 text-center">
              <Link to="/kit" className="btn-outline text-sm">
                ← Back to kits
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
