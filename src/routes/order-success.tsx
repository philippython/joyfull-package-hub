import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/order-success")({
  validateSearch: (s) => z.object({ id: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Order received — Rewindd" }] }),
  component: Success,
});

function Success() {
  const { id } = Route.useSearch();
  return (
    <SiteLayout>
      <section className="min-h-[70vh] bg-cream flex items-center justify-center px-6 pt-32 pb-24">
        <div className="max-w-xl text-center">
          <div className="eyebrow justify-center mb-6">Thank You</div>
          <h1 className="section-title">Your kit is on its way<br/>to <em>being made.</em></h1>
          <p className="mt-6 text-warm-gray leading-relaxed">
            We've received your order{id ? <> — <span className="font-mono text-xs">#{id.slice(0, 8)}</span></> : null}. You'll receive an email shortly with payment instructions and shipping details. Each kit is hand-assembled with care.
          </p>
          <Link to="/" className="btn-primary mt-10 inline-flex">Back home</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
