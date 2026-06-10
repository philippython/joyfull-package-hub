import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/site-layout";
import { getProductBySlug } from "@/lib/products.functions";
import OrderForm from "@/components/order-form";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const Route = createFileRoute("/checkout")({
  validateSearch: (s) => z.object({ slug: z.string().min(1) }).parse(s),
  head: () => ({ meta: [{ title: "Checkout — Rewindd" }] }),
  component: Checkout,
});

function Checkout() {
  const { slug } = Route.useSearch();
  const get = useServerFn(getProductBySlug);
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => get({ data: { slug } }),
  });

  if (isLoading || !product) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="pt-32 pb-20 px-6 bg-cream">
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow">Checkout</div>
          <h1 className="font-serif font-light text-3xl text-charcoal mt-4">{product.name}</h1>
          <div className="mt-6">
            <OrderForm
              productId={product.id}
              priceCents={product.price_cents}
              currency={product.currency}
            />
          </div>
          <div className="mt-6 text-center">
            <StripeCheckoutButton product={product} />
          </div>
          <div className="mt-6 text-center">
            <Link to={`/kit/${product.slug}`} className="btn-outline">
              Back to product
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function StripeCheckoutButton({ product }: { product: any }) {
  const create = useServerFn(createCheckoutSession);
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    try {
      const res = await create({
        data: {
          productId: product.id,
          priceCents: product.price_cents,
          currency: product.currency,
        },
      });
      if (res?.url) window.location.href = res.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Stripe checkout failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button onClick={onClick} disabled={loading} className="btn-primary">
      {loading ? "Redirecting…" : "Pay with Card"}
    </button>
  );
}
