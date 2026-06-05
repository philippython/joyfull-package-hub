import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Rewindd Date Night Kit" },
      { name: "description", content: "Answers to the most common questions about Rewindd — who it's for, how it works, shipping, returns and gifting." },
      { property: "og:title", content: "Rewindd — Frequently Asked Questions" },
      { property: "og:description", content: "Who Rewindd is for, how it works, shipping, returns and gifting." },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  { q: "Who is Rewindd for?", a: "Rewindd is for couples who still love each other but want to spend more intentional time together. It is ideal for busy couples, married couples, parents, newlyweds and couples who want a meaningful date night at home." },
  { q: "Is this only for couples having problems?", a: "No. Rewindd is not therapy and it is not for fixing broken relationships. It is for couples who are okay, but feel like life has become busy and quality time has slipped away." },
  { q: "What if my partner isn't good at deep conversations?", a: "That is exactly why the cards exist. The prompts guide the conversation, so neither of you has to force it or think of what to say." },
  { q: "Will it feel awkward?", a: "No pressure. The guide and cards are designed to make the evening feel natural, relaxed and easy to follow." },
  { q: "How long does the experience take?", a: "Most couples spend around 60–90 minutes with Rewindd, but there is no strict timing. You can go at your own pace." },
  { q: "Is it a one-time experience?", a: "No. The cards and guide can be used again for future date nights. The candle and massage oil are consumable items." },
  { q: "Can I buy it as a gift?", a: "Yes. Rewindd makes a thoughtful gift for anniversaries, weddings, birthdays, Valentine's Day, newlyweds or couples who deserve intentional time together." },
  { q: "Can I return my kit?", a: "Yes. We accept returns within 14 days of delivery, provided the kit is returned in its original condition and the massage oil seal remains unopened. For hygiene reasons, kits with opened oil bottles cannot be returned." },
  { q: "What if my order arrives damaged?", a: "Please email us within 48 hours of delivery with photos of the item and packaging at rewindd2026@gmail.com, and we'll arrange a replacement as quickly as possible." },
  { q: "How quickly will my order arrive?", a: "Orders are dispatched within 2–3 business days. Tracking details will be sent once your order is on its way." },
  { q: "Do you ship outside the UK?", a: "At the moment, Rewindd is available for UK delivery only." },
];

function FaqPage() {
  return (
    <SiteLayout>
      <section className="bg-charcoal text-cream pt-36 pb-20 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-5">Questions</div>
        <h1 className="font-serif font-light text-[clamp(36px,6vw,64px)] leading-[1.1] max-w-3xl mx-auto">
          Things people <em>ask us.</em>
        </h1>
      </section>
      <section className="bg-cream py-20 px-6">
        <div className="max-w-3xl mx-auto">
          {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          <div className="text-center mt-14">
            <Link to="/kit" className="btn-primary">Get Your Date Night Kit — £39.99</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-burgundy/15">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-5 text-left font-serif text-lg text-burgundy-deep hover:text-burgundy transition">
        <span className="pr-4">{q}</span>
        <span className={`text-gold text-xl transition-transform shrink-0 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="pb-5 text-sm text-warm-gray leading-relaxed">{a}</p>}
    </div>
  );
}
