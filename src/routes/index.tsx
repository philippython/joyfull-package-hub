import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import heroImg from "@/assets/photo-couple-mask.jpg";
import boxImg from "@/assets/photo-box.jpg";
import openBox from "@/assets/photo-open-box.webp";
import flatlay from "@/assets/photo-flatlay.webp";
import coupleCards from "@/assets/photo-couple-cards.webp";
import cardImg from "@/assets/photo-card.jpg";
import detail1 from "@/assets/photo-detail-1.avif";
import detail2 from "@/assets/photo-detail-2.avif";
import detail3 from "@/assets/photo-detail-3.avif";
import detail4 from "@/assets/photo-detail-4.avif";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rewindd — Date Night Ritual Kit for Couples Who Still Love Each Other" },
      { name: "description", content: "A premium reconnection ritual for busy couples. One quiet evening to come home to each other. £40 — shipped worldwide." },
      { property: "og:title", content: "Rewindd — A Date Night Ritual Worth Showing Up For" },
      { property: "og:description", content: "Pause. Connect. Reignite. Hand-packed kits for the couples who still love each other deeply." },
    ],
  }),
  component: Home,
});

const insideItems = [
  { name: "52 Conversation Prompts", desc: "Linen-bound cards that move past 'how was your day' and into the questions you used to ask each other when you were still falling." },
  { name: "Hand-poured Soy Candle", desc: "Vanilla, warm and quiet. Lights the room — and signals the shift. Phones away. Hearts open." },
  { name: "Ritual Massage Oil", desc: "Pressed in amber glass. A small invitation to slow down, to touch on purpose, to remember the language of hands." },
  { name: "Silk Eye Mask", desc: "Soft champagne silk for the closing meditation. Three minutes of nothing but breath, and the person beside you." },
  { name: "Welcome Ritual Card", desc: "Your evening, laid out in three gentle acts. No guessing, no figuring it out. Just open it together and follow along." },
  { name: "Matte Black Gift Box", desc: "Sealed with our seal. Heavy in the hand. Feels like the gift it is — for them, or for the two of you." },
];

const testimonials = [
  { text: "We were roommates with rings on. One evening with Rewindd reminded us why we chose each other in the first place.", author: "Maya & James", loc: "Brooklyn, NY" },
  { text: "I cried twice — the good kind. We've already ordered two more for our anniversaries.", author: "Priya & Rohan", loc: "London, UK" },
  { text: "The kit does the hard part. You just have to show up. And we showed up — together.", author: "Elena & Marco", loc: "Lisbon, PT" },
];

const steps = [
  { n: 1, t: "Open Together", d: "Light the candle. Pour the wine. Read the welcome card aloud — slowly." },
  { n: 2, t: "Move Through It", d: "Three quiet acts: remember, reveal, reconnect. The cards lead, you follow." },
  { n: 3, t: "Close Slowly", d: "Slip on the silk mask. Three deep breaths. One promise made for the week ahead." },
];

const faqs = [
  { q: "Who is this kit for?", a: "Couples who still love each other deeply — but whose calendar, kids, or careers have made true connection feel like a thing you used to do. Long-term partners, newlyweds, anyone wanting to come back to each other." },
  { q: "How long does the evening take?", a: "Most couples spend ninety minutes to two hours with it. There's no clock — go at the pace that feels honest to the two of you." },
  { q: "Is it reusable?", a: "Yes. The cards, oils, candle and box are designed to be returned to. We recommend one full ritual per month, or whenever the noise gets loud again." },
  { q: "Do you ship internationally?", a: "Yes — we ship worldwide. Orders dispatch within 2–3 business days. International delivery times vary by destination." },
  { q: "Can I gift it?", a: "Absolutely. The packaging is intentionally giftable — every kit ships sealed, ready to hand over. Add a note at checkout and we'll include it." },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative h-screen min-h-[680px] flex items-center justify-center overflow-hidden bg-[color:var(--color-black,#0d0a08)]">
        <img src={heroImg} alt="A couple sharing a quiet moment with the Rewindd ritual kit" className="absolute inset-0 w-full h-full object-cover opacity-70" width={1920} height={1080} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,10,8,0.55) 0%, rgba(13,10,8,0.3) 40%, rgba(13,10,8,0.9) 100%)" }} />
        <div className="relative z-10 max-w-4xl text-center px-6">
          <div className="eyebrow mb-8 justify-center !text-[color:var(--color-gold)]">Date Night Ritual Kit</div>
          <h1 className="font-serif font-light text-cream leading-[1.05] text-[clamp(44px,8vw,96px)]">
            We didn't fall out<br/>of love. <em>Life just<br/>got loud.</em>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-cream/75 text-base md:text-lg leading-relaxed">
            A premium reconnection ritual for the couples who still love each other deeply — but miss feeling truly close.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/kit" className="btn-primary">Order Yours — £40</Link>
            <a href="#story" className="btn-outline">Explore Rewindd</a>
          </div>
        </div>
        <a href="#story" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50 text-[10px] tracking-[0.3em] uppercase">Scroll</a>
      </section>

      {/* STORY */}
      <section id="story" className="grid md:grid-cols-2 gap-16 md:gap-24 max-w-6xl mx-auto px-6 py-28 items-center">
        <div>
          <img src={boxImg} alt="The matte black Rewindd box, sealed and ready to open" loading="lazy" width={1024} height={1024} className="w-full aspect-[4/5] object-cover" />
        </div>
        <div>
          <div className="eyebrow mb-6">The Quiet Truth</div>
          <h2 className="section-title">
            You still love them.<br/>You just <em>forgot how</em><br/>to find them.
          </h2>
          <div className="mt-8 space-y-5 text-warm-gray leading-relaxed">
            <p>The bills get paid. The kids get fed. The week ends. And somewhere in the middle of all of it, the two of you stopped meeting each other's eyes the way you used to.</p>
            <p>It isn't a crisis. It isn't the end. It's the slow, quiet drift no one warns you about — the one that happens while you're busy holding everything else together.</p>
            <p className="font-serif italic text-xl text-charcoal leading-snug">Rewindd is one evening, designed to bring you back to each other.</p>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="bg-[color:var(--color-burgundy-deep)] text-cream px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="eyebrow !text-[color:var(--color-gold)] justify-center">Inside The Box</div>
            <h2 className="section-title !text-cream mt-4">Everything you need.<br/><em>Nothing you don't.</em></h2>
            <p className="mt-6 max-w-xl mx-auto text-cream/60">Each kit is hand-assembled in small batches, sealed by hand, and shipped in matte black packaging worth keeping long after the evening ends.</p>
          </div>
          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <img src={openBox} alt="The Rewindd ritual kit, opened — candle, cards, oil, silk mask and welcome card" loading="lazy" width={1400} height={1700} className="w-full aspect-[4/5] object-cover" />
            <ul className="space-y-7">
              {insideItems.map((it) => (
                <li key={it.name} className="border-b border-gold/15 pb-6">
                  <div className="font-serif text-2xl text-cream">{it.name}</div>
                  <p className="text-[13px] text-cream/55 mt-2 leading-relaxed">{it.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* DETAIL STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-black">
        {[detail1, cardImg, detail3, detail2].map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img src={src} alt="Rewindd ritual kit detail" loading="lazy" width={800} height={800} className="w-full h-full object-cover brightness-90 hover:brightness-100 hover:scale-105 transition-all duration-700" />
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[color:var(--color-burgundy)] text-cream px-6 py-28 text-center">
        <div className="eyebrow !text-[color:var(--color-gold)] justify-center">The Evening</div>
        <h2 className="section-title !text-cream mt-4">Three soft acts.<br/><em>One quiet night.</em></h2>
        <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-3 gap-12 md:gap-6">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="w-14 h-14 mx-auto rounded-full border border-gold flex items-center justify-center font-serif text-xl text-gold mb-6">{s.n}</div>
              <div className="font-serif text-2xl text-cream mb-3">{s.t}</div>
              <p className="text-[13px] text-cream/55 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COUPLE PHOTO BREAK */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img src={coupleCards} alt="A couple drawing cards together by candlelight" loading="lazy" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 text-center px-6">
          <p className="font-serif italic text-2xl md:text-4xl text-cream leading-snug max-w-2xl mx-auto">
            "The kit does the hard part. <em>You just have to show up.</em>"
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 bg-ivory">
        <div className="max-w-6xl mx-auto text-center">
          <div className="eyebrow justify-center">From Real Couples</div>
          <h2 className="section-title mt-4">Words from the ones<br/>who <em>showed up.</em></h2>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-white p-10 border-b-2 border-gold text-left relative">
                <span className="absolute top-3 left-6 font-serif text-7xl text-gold/20 leading-none">“</span>
                <p className="font-serif italic text-lg leading-relaxed text-charcoal">{t.text}</p>
                <div className="mt-6">
                  <div className="text-[11px] tracking-[0.18em] uppercase text-gold">{t.author}</div>
                  <div className="text-[11px] text-warm-gray mt-1">{t.loc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="bg-cream py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <img src={flatlay} alt="The full Rewindd ritual kit laid out — candle, cards, oil, silk mask" loading="lazy" width={1024} height={1280} className="w-full aspect-[4/5] object-cover" />
          <div>
            <div className="eyebrow">Our Story</div>
            <h2 className="section-title mt-4">Built by two people<br/>who almost <em>drifted apart.</em></h2>
            <p className="mt-6 text-warm-gray leading-relaxed">We made the first version of this kit for ourselves, on a Tuesday night, after a year that nearly broke us. It worked. So we made one for our closest friends. Then their friends. Now, it ships from our hands to yours.</p>
            <Link to="/our-story" className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)] mt-8 hover:!bg-[color:var(--color-burgundy)] hover:!text-cream">Read our story</Link>
          </div>
        </div>
      </section>

      {/* POLICIES */}
      <section id="policies" className="py-28 px-6 bg-ivory border-t border-burgundy/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="eyebrow justify-center">Shipping, Returns & Care</div>
            <h2 className="section-title mt-4">The <em>small print,</em><br/>kindly written.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PolicyCard
              title="Dispatch"
              body="Every kit is hand-assembled and dispatched within 2–3 business days of your order. You'll receive tracking the moment it leaves us."
            />
            <PolicyCard
              title="Returns"
              body="We accept returns within 14 days of delivery, on unopened kits with the seal intact. Return shipping is paid by the buyer. Please email us before sending anything back."
            />
            <PolicyCard
              title="Damaged on arrival"
              body={(
                <>
                  If your kit arrives damaged, send a photo of the product and its condition within <strong>48 hours of receipt</strong> to{" "}
                  <a href="mailto:rewindd2026@gmail.com" className="text-burgundy underline underline-offset-2 hover:text-gold">rewindd2026@gmail.com</a>{" "}
                  and we'll replace it, free of charge.
                </>
              )}
            />
            <PolicyCard
              title="International shipping"
              body="We ship worldwide. Duties and import taxes may apply on arrival and are the buyer's responsibility — please check your local rules before ordering."
            />
            <PolicyCard
              title="Order changes"
              body="Need to change an address or cancel? Reach out within 24 hours of ordering and we'll do our best — once the kit is sealed and shipped we can't recall it."
            />
            <PolicyCard
              title="Get in touch"
              body={(
                <>
                  Questions, gifting requests, or anything in between — write to{" "}
                  <a href="mailto:rewindd2026@gmail.com" className="text-burgundy underline underline-offset-2 hover:text-gold">rewindd2026@gmail.com</a>.
                  We reply within one business day.
                </>
              )}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="eyebrow justify-center">Questions</div>
            <h2 className="section-title mt-4">Things people <em>ask us.</em></h2>
          </div>
          <div className="mt-12">
            {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 px-6 text-center text-cream overflow-hidden bg-charcoal">
        <img src={detail4} alt="" loading="lazy" width={1024} height={1024} className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="eyebrow justify-center mb-6">Tonight, Not Someday</div>
          <h2 className="font-serif font-light text-[clamp(40px,6vw,72px)] leading-[1.1] text-cream">
            The love is still there.<br/><em>Come find it.</em>
          </h2>
          <Link to="/kit" className="btn-primary mt-10">Order Your Kit — £40</Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function PolicyCard({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="bg-white p-8 border border-burgundy/10 hover:border-gold transition-colors">
      <div className="font-serif text-xl text-burgundy-deep mb-3">{title}</div>
      <p className="text-sm text-warm-gray leading-relaxed">{body}</p>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-burgundy/15">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center py-6 text-left font-serif text-lg text-burgundy-deep hover:text-burgundy transition">
        {q}
        <span className={`text-gold text-xl transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <p className="pb-6 text-sm text-warm-gray leading-relaxed">{a}</p>}
    </div>
  );
}
