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
import about1 from "@/assets/about-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rewindd — Date Night Box for Couples UK" },
      { name: "description", content: "A romantic at-home date night kit for busy couples in the UK. Conversation cards, candle, oil and more — £40, dispatched in 2–3 business days." },
      { property: "og:title", content: "Rewindd — Date Night Kit for Couples" },
      { property: "og:description", content: "One intentional evening of conversation, connection and quality time — from the comfort of home." },
    ],
  }),
  component: Home,
});

const gallery = [openBox, flatlay, cardImg, detail1, detail2, detail3, boxImg, coupleCards];

const steps = [
  {
    n: 1,
    t: "Open Together",
    img: openBox,
    lines: ["Light the candle.", "Start the playlist.", "Put your phones away."],
  },
  {
    n: 2,
    t: "Reconnect Through Conversation",
    img: cardImg,
    lines: ["Laugh.", "Reflect.", "Reconnect.", "Let the cards guide the conversation."],
  },
  {
    n: 3,
    t: "Close Slowly",
    img: detail4,
    lines: ["Massage.", "Touch.", "Presence.", "End the evening feeling closer than when it began."],
  },
];

const faqs = [
  { q: "Who is Rewindd for?", a: "Rewindd is for couples who still love each other but want to spend more intentional time together. It is ideal for busy couples, married couples, parents, newlyweds and couples who want a meaningful date night at home." },
  { q: "Is this only for couples having problems?", a: "No. Rewindd is not therapy and it is not for fixing broken relationships. It is for couples who are okay, but feel like life has become busy and quality time has slipped away." },
  { q: "What if my partner isn't good at deep conversations?", a: "That is exactly why the cards exist. The prompts guide the conversation, so neither of you has to force it or think of what to say." },
  { q: "Will it feel awkward?", a: "No pressure. The guide and cards are designed to make the evening feel natural, relaxed and easy to follow." },
  { q: "How long does the experience take?", a: "Most couples spend around 60–90 minutes with Rewindd, but there is no strict timing. You can go at your own pace." },
  { q: "Is it a one-time experience?", a: "No. The cards and guide can be used again for future date nights. The candle and massage oil are consumable items." },
  { q: "Can I buy it as a gift?", a: "Yes. Rewindd makes a thoughtful gift for anniversaries, weddings, birthdays, Valentine's Day, newlyweds or couples who deserve intentional time together." },
  { q: "Can I return my kit?", a: "Yes. We accept returns within 14 days of delivery, provided the kit is returned in its original condition and the massage oil seal remains unopened. For hygiene reasons, kits with opened oil bottles cannot be returned." },
  { q: "What if my order arrives damaged?", a: "Please email us within 48 hours of delivery with photos of the item and packaging, and we'll arrange a replacement as quickly as possible." },
  { q: "How quickly will my order arrive?", a: "Orders are dispatched within 2–3 business days. Tracking details will be sent once your order is on its way." },
  { q: "Do you ship outside the UK?", a: "At the moment, Rewindd is available for UK delivery only." },
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
            We didn't fall out<br/>of love. <em>Life just<br/>got busy.</em>
          </h1>
          <p className="mt-8 max-w-xl mx-auto text-cream/80 text-base md:text-lg leading-relaxed">
            For couples who still love each other but haven't had a proper moment together in a while.
          </p>
          <p className="mt-4 max-w-xl mx-auto text-cream/70 text-sm md:text-base leading-relaxed">
            Rewindd guides you through one intentional evening of conversation, connection and quality time — all from the comfort of home.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/kit" className="btn-primary">Get Your Date Night Kit — £39.99</Link>
            <a href="#story" className="btn-outline">Our Story</a>
          </div>
        </div>
        <a href="#story" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/50 text-[10px] tracking-[0.3em] uppercase">Scroll</a>
      </section>

      {/* QUIET TRUTH */}
      <section className="grid md:grid-cols-2 gap-16 md:gap-24 max-w-6xl mx-auto px-6 py-28 items-center">
        <div>
          <img src={boxImg} alt="The Rewindd box, sealed and ready" loading="lazy" width={1024} height={1024} className="w-full aspect-[4/5] object-cover" />
        </div>
        <div>
          <div className="eyebrow mb-6">The Quiet Truth</div>
          <h2 className="section-title">
            You still love each other.<br/><em>Life has just been busy.</em>
          </h2>
          <div className="mt-8 space-y-4 text-warm-gray leading-relaxed">
            <p>Work gets busy.</p>
            <p>The kids need attention.</p>
            <p>The house always seems to need something.</p>
            <p>Before you know it, most of your conversations become about what's for dinner, what's happening tomorrow, and who is doing the school run.</p>
            <p>Not because the love is gone. But because life has been loud.</p>
            <p className="font-serif italic text-xl text-charcoal leading-snug pt-2">
              Rewindd was created for couples who still love each other but want to be more intentional about spending quality time together.
            </p>
            <p>One evening. No restaurant booking. No childminder. No pressure.</p>
            <p className="font-serif italic text-lg text-burgundy">Just the two of you.</p>
          </div>
        </div>
      </section>

      {/* INSIDE THE BOX — visual */}
      <section id="product" className="bg-[color:var(--color-burgundy-deep)] text-cream px-6 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <div className="eyebrow !text-[color:var(--color-gold)] justify-center">Inside The Box</div>
            <h2 className="section-title !text-cream mt-4">Everything you need.<br/><em>Nothing you don't.</em></h2>
            <p className="mt-6 text-cream/65 leading-relaxed">
              Every detail inside Rewindd was chosen to help you slow down, reconnect, and enjoy intentional time together.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-6 grid-rows-3 gap-3 md:gap-4 h-[560px] md:h-[760px]">
            <div className="col-span-4 row-span-2 overflow-hidden">
              <img src={flatlay} alt="Full Rewindd kit flat lay" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img src={cardImg} alt="Close-up of the conversation cards" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img src={detail2} alt="Close-up of the candle" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img src={detail1} alt="Close-up of the massage oil" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img src={openBox} alt="The open Rewindd box" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img src={detail3} alt="Lifestyle detail of the kit" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/kit" className="btn-outline !text-gold !border-gold hover:!bg-gold hover:!text-burgundy-deep">View the Product</Link>
          </div>
        </div>
      </section>

      {/* EXPERIENCE FLOW */}
      <section className="bg-[color:var(--color-burgundy)] text-cream px-6 py-28">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="section-title !text-cream">Three simple steps.<br/><em>One intentional evening.</em></h2>
        </div>
        <div className="mt-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="aspect-[4/5] overflow-hidden mb-6">
                <img src={s.img} alt={s.t} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="w-10 h-10 mx-auto rounded-full border border-gold flex items-center justify-center font-serif text-gold mb-4">{s.n}</div>
              <div className="font-serif text-2xl text-cream mb-4">{s.t}</div>
              <div className="space-y-1 text-cream/70 text-[14px] leading-relaxed">
                {s.lines.map((l, i) => <p key={i}>{l}</p>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE PHOTO */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img src={coupleCards} alt="A couple drawing cards together by candlelight" loading="lazy" width={1920} height={1280} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 text-center px-6">
          <p className="font-serif italic text-2xl md:text-4xl text-cream leading-snug max-w-2xl mx-auto">
            "The kit does the hard part. <em>You just have to show up.</em>"
          </p>
        </div>
      </section>

      {/* OUR STORY — founder */}
      <section id="story" className="py-28 px-6 bg-cream">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="md:sticky md:top-28">
            <img src={about1} alt="Founder" loading="lazy" width={1024} height={1280} className="w-full aspect-[4/5] object-cover" />
          </div>
          <div>
            <div className="eyebrow">Our Story</div>
            <h2 className="section-title mt-4">The love was still there.<br/><em>Life just got busy.</em></h2>
            <div className="mt-8 space-y-4 text-warm-gray leading-relaxed">
              <p>Nobody really talks about marriages where nothing is wrong.</p>
              <p>You still love each other.</p>
              <p>You still care.</p>
              <p>You still show up every day.</p>
              <p>But somewhere between work, children, responsibilities and trying to keep life moving, quality time together quietly disappears.</p>
              <p>You still talk. But you're not really connecting the way you used to.</p>
              <p>And because you're not fighting, it's hard to explain.</p>
              <p className="font-serif italic text-xl text-charcoal leading-snug">Nothing is wrong. But something feels missing.</p>
              <p>When I started looking for ways couples could reconnect, everything felt too extreme.</p>
              <p>Therapy. Relationship programmes. Fixing broken marriages.</p>
              <p>But that wasn't us. We didn't need fixing.</p>
              <p>We simply needed intentional time together again.</p>
              <p>Something simple. Something realistic. Something we could do from home without the pressure of planning a date night, finding a babysitter or spending a fortune.</p>
              <p className="font-serif italic text-xl text-burgundy leading-snug">That idea became Rewindd.</p>
              <p>A simple invitation to slow down, put life on pause for a moment, and reconnect with the person you chose.</p>
              <p>Because love doesn't always need fixing.</p>
              <p className="font-serif italic text-lg text-charcoal">Sometimes it just needs time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-1 bg-black">
        {gallery.slice(0, 4).map((src, i) => (
          <div key={i} className="aspect-square overflow-hidden">
            <img src={src} alt="Rewindd kit detail" loading="lazy" className="w-full h-full object-cover brightness-90 hover:brightness-100 hover:scale-105 transition-all duration-700" />
          </div>
        ))}
      </section>

      {/* POLICIES */}
      <section id="policies" className="py-28 px-6 bg-ivory border-t border-burgundy/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="eyebrow justify-center">Shipping, Returns & Care</div>
            <h2 className="section-title mt-4"><em>Everything</em> you need to know.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <PolicyCard
              title="Shipping & Delivery"
              body="Every Rewindd kit is carefully packed by hand and dispatched within 2–3 business days. You'll receive tracking details as soon as your order is on its way."
            />
            <PolicyCard
              title="Returns"
              body="We accept returns within 14 days of delivery. To be eligible for a refund, all items must be returned in their original condition. For hygiene reasons, the massage oil seal must remain unopened and unbroken."
            />
            <PolicyCard
              title="Damaged on Arrival"
              body={(
                <>
                  If your order arrives damaged or incorrect, please email us within <strong>48 hours of delivery</strong> with photos of the item and packaging at{" "}
                  <a href="mailto:rewindd2026@gmail.com" className="text-burgundy underline underline-offset-2 hover:text-gold">rewindd2026@gmail.com</a>. We'll arrange a replacement as quickly as possible.
                </>
              )}
            />
            <PolicyCard
              title="UK Delivery Only"
              body="At this time, Rewindd is available for delivery within the United Kingdom only."
            />
            <PolicyCard
              title="Changing of Order"
              body="Need to update your delivery address or cancel your order? Please contact us within 2 hours of placing your order. Once your order has been processed, changes can no longer be made."
            />
            <PolicyCard
              title="Get in Touch"
              body={(
                <>
                  Questions, gifting enquiries or order support?{" "}
                  <a href="mailto:rewindd2026@gmail.com" className="text-burgundy underline underline-offset-2 hover:text-gold">rewindd2026@gmail.com</a>. We aim to respond within one business day.
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

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-ivory border-t border-burgundy/10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="eyebrow justify-center">Contact Us</div>
          <h2 className="section-title mt-4">Say <em>hello.</em></h2>
          <p className="mt-6 text-warm-gray leading-relaxed">
            Questions, gifting enquiries or order support — we'd love to hear from you. We aim to respond within one business day.
          </p>
          <a href="mailto:rewindd2026@gmail.com" className="btn-primary mt-8 inline-block">rewindd2026@gmail.com</a>
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
          <Link to="/kit" className="btn-primary mt-10">Get Your Date Night Kit — £39.99</Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function PolicyCard({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="bg-white p-8 border border-burgundy/10 hover:border-gold transition-colors">
      <div className="font-serif text-xl text-burgundy-deep mb-3">{title}</div>
      <div className="text-sm text-warm-gray leading-relaxed">{body}</div>
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
