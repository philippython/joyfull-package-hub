import { createFileRoute, Link } from "@tanstack/react-router";
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
      { title: "Rewindd — Date Night Box for Couples UK" },
      {
        name: "description",
        content:
          "A romantic at-home date night kit for busy couples in the UK. Conversation cards, candle, oil and more — £39.99, dispatched in 2–3 business days.",
      },
      { property: "og:title", content: "Rewindd — Date Night Kit for Couples" },
      {
        property: "og:description",
        content:
          "One intentional evening of conversation, connection and quality time — from the comfort of home.",
      },
    ],
  }),
  component: Home,
});

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
    lines: ["Massage.", "Touch.", "Presence.", "End the evening feeling closer."],
  },
];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative h-screen min-h-[560px] flex items-center justify-center overflow-hidden bg-[color:var(--color-black,#0d0a08)]">
        <img
          src={heroImg}
          alt="A couple sharing a quiet moment with the Rewindd ritual kit"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative z-10 max-w-4xl text-center px-6">
          <div className="eyebrow mb-6 justify-center !text-[color:var(--color-gold)]">
            Date Night Ritual Kit
          </div>
          <h1 className="hero-headline">
            We didn't fall out of love.
            <br />
            Life just got busy.
          </h1>
          <p className="hero-subhead">
            For couples who still love each other but haven't had quality time together in a while.
          </p>
          <div className="mt-6 flex flex-col items-center gap-2">
            <Link to="/kit" className="btn-primary px-8 py-3 text-[13px] tracking-[0.22em]">
              GET YOUR DATE NIGHT KIT
            </Link>
            <div className="hero-price">£39.99</div>
          </div>
        </div>
      </section>

      {/* QUIET TRUTH */}
      <section className="grid md:grid-cols-2 gap-16 md:gap-24 max-w-6xl mx-auto px-6 py-24 items-center">
        <div>
          <img
            src={boxImg}
            alt="The Rewindd box, sealed and ready"
            loading="lazy"
            width={1024}
            height={1024}
            className="w-full aspect-[4/5] object-cover"
          />
        </div>
        <div>
          <div className="eyebrow mb-6">The Quiet Truth</div>
          <h2 className="section-title">
            You still love each other.
            <br />
            <em>Life has just been busy.</em>
          </h2>
          <div className="mt-8 space-y-4 text-charcoal/80 leading-8">
            <p>
              Work gets busy. The kids need attention. The house always seems to need something.
            </p>
            <p>
              Before you know it, most of your conversations become about what's for dinner, what's
              happening tomorrow, and who is doing the school run.
            </p>
            <p>Not because the love is gone. But because life has been loud.</p>
            <p className="font-serif italic text-2xl text-charcoal leading-snug pt-2">
              Rewindd was created for couples who still love each other but want to be more
              intentional about spending quality time together.
            </p>
            <p className="font-serif italic text-xl text-burgundy">Just the two of you.</p>
          </div>
        </div>
      </section>

      {/* INSIDE THE BOX */}
      <section id="product" className="bg-[color:var(--color-burgundy-deep)] text-cream px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <div className="eyebrow !text-[color:var(--color-gold)] justify-center">
              Inside The Box
            </div>
            <h2 className="section-title !text-cream mt-4">
              One Kit.
              <br />
              <em>More Time Together.</em>
            </h2>
            <p className="mt-6 text-cream/80 leading-relaxed">
              Every detail inside Rewindd was chosen to help you slow down, reconnect, and enjoy
              intentional time together.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-6 grid-rows-3 gap-3 md:gap-4 h-[560px] md:h-[760px]">
            <div className="col-span-4 row-span-2 overflow-hidden">
              <img
                src={flatlay}
                alt="Full Rewindd kit flat lay"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img
                src={cardImg}
                alt="Conversation cards"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img
                src={detail2}
                alt="Candle"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img
                src={detail1}
                alt="Massage oil"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img
                src={openBox}
                alt="Open box"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-1 overflow-hidden">
              <img
                src={detail3}
                alt="Lifestyle detail"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-center mt-12">
            <Link
              to="/kit"
              className="btn-outline !text-gold !border-gold hover:!bg-gold hover:!text-burgundy-deep"
            >
              Order your date night kit
            </Link>
          </div>
        </div>
      </section>

      {/* EXPERIENCE FLOW */}
      <section className="bg-[color:var(--color-burgundy)] text-cream px-6 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="section-title !text-cream">
            Three simple steps.
            <br />
            <em>One intentional evening.</em>
          </h2>
        </div>
        <div className="mt-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n} className="text-center">
              <div className="aspect-[4/5] overflow-hidden mb-6">
                <img src={s.img} alt={s.t} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="w-10 h-10 mx-auto rounded-full border border-gold flex items-center justify-center font-serif text-gold mb-4">
                {s.n}
              </div>
              <div className="font-serif text-2xl text-cream mb-4">{s.t}</div>
              <div className="space-y-1 text-cream/80 text-[14px] leading-relaxed">
                {s.lines.map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUOTE PHOTO */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(420px, 70vh, 760px)" }}
      >
        <img
          src={coupleCards}
          alt="A couple drawing cards together by candlelight"
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        {/* Vignette — dark at edges, lighter in middle */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Quote + CTA — stacked at bottom of image */}
        <div
          style={{
            position: "absolute",
            bottom: "8%",
            left: 0,
            right: 0,
            textAlign: "center",
            padding: "0 1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <p
            className="font-serif"
            style={{
              fontStyle: "italic",
              fontSize: "clamp(1.4rem, 3.5vw, 3rem)",
              color: "#fff",
              lineHeight: 1.3,
              maxWidth: "36rem",
              margin: 0,
              textShadow: "0 2px 24px rgba(0,0,0,0.6)",
              letterSpacing: "0.01em",
            }}
          >
            "One evening. No distractions. Just us."
          </p>
          <Link
            to="/kit"
            className="btn-primary"
            style={{ fontSize: "0.7rem", letterSpacing: "0.2em" }}
          >
            GET YOUR KIT — £39.99
          </Link>
        </div>
      </section>

      {/* QUICK NAV CARDS */}
      <section className="bg-cream py-20 px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
          <NavCard to="/our-story" eyebrow="Our Story" title="The love was still there." />
          <NavCard to="/faq" eyebrow="Questions" title="Things people ask us." />
          <NavCard
            to="/policies"
            eyebrow="Shipping & Returns"
            title="Everything you need to know."
          />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-32 px-6 text-center text-cream overflow-hidden bg-charcoal">
        <img
          src={detail4}
          alt=""
          loading="lazy"
          width={1024}
          height={1024}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="eyebrow justify-center mb-6">Tonight, Not Someday</div>
          <h2 className="font-serif font-light text-[clamp(40px,6vw,72px)] leading-[1.1] text-cream">
            The love is still there.
            <br />
            <em>Come find it.</em>
          </h2>
          <Link to="/kit" className="btn-primary mt-10">
            Get Your Date Night Kit — £39.99
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}

function NavCard({
  to,
  eyebrow,
  title,
}: {
  to: "/our-story" | "/faq" | "/policies";
  eyebrow: string;
  title: string;
}) {
  return (
    <Link
      to={to}
      className="block bg-white p-8 border border-burgundy/10 hover:border-gold transition-colors group"
    >
      <div className="eyebrow">{eyebrow}</div>
      <div className="font-serif text-xl text-burgundy-deep mt-3 group-hover:text-burgundy transition">
        {title}
      </div>
      <div className="mt-4 text-[11px] tracking-[0.2em] uppercase text-gold">Read more →</div>
    </Link>
  );
}
