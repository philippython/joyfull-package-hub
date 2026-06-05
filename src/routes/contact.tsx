import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rewindd" },
      { name: "description", content: "Questions, gifting enquiries or order support — email rewindd2026@gmail.com. We aim to respond within one business day." },
      { property: "og:title", content: "Contact Rewindd" },
      { property: "og:description", content: "Get in touch about your order, gifting or anything else." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-charcoal text-cream pt-36 pb-20 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-5">Contact Us</div>
        <h1 className="font-serif font-light text-[clamp(36px,6vw,64px)] leading-[1.1]">
          Say <em>hello.</em>
        </h1>
      </section>
      <section className="bg-cream py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-warm-gray leading-relaxed">
            Questions, gifting enquiries or order support — we'd love to hear from you. We aim to respond within one business day.
          </p>
          <a href="mailto:rewindd2026@gmail.com" className="btn-primary mt-8 inline-block">rewindd2026@gmail.com</a>

          <div className="mt-14 pt-10 border-t border-burgundy/10 text-sm text-warm-gray leading-relaxed space-y-2">
            <p><span className="text-burgundy-deep font-medium">Damaged order?</span> Email us within 48 hours of delivery with photos of the item and packaging.</p>
            <p><span className="text-burgundy-deep font-medium">Order changes?</span> Reach out within 2 hours of placing your order.</p>
            <p><span className="text-burgundy-deep font-medium">Shipping:</span> UK only. Dispatched in 2–3 business days.</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
