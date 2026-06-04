import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Rewindd" },
      { name: "description", content: "The love was still there. Life just got busy. Why we built Rewindd." },
    ],
  }),
  component: OurStory,
});

function OurStory() {
  const paragraphs = [
    "Nobody really talks about marriages where nothing is wrong.",
    "You still love each other.",
    "You still care.",
    "You still show up every day.",
    "But somewhere between work, children, responsibilities and trying to keep life moving, quality time together quietly disappears.",
    "You still talk.",
    "But you're not really connecting the way you used to.",
    "And because you're not fighting, it's hard to explain.",
    "Nothing is wrong. But something feels missing.",
    "When I started looking for ways couples could reconnect, everything felt too extreme.",
    "Therapy. Relationship programmes. Fixing broken marriages.",
    "But that wasn't us. We didn't need fixing.",
    "We simply needed intentional time together again.",
    "Something simple. Something realistic. Something we could do from home without the pressure of planning a date night, finding a babysitter or spending a fortune.",
    "That idea became Rewindd.",
    "A simple invitation to slow down, put life on pause for a moment, and reconnect with the person you chose.",
    "Because love doesn't always need fixing.",
    "Sometimes it just needs time.",
  ];

  return (
    <SiteLayout>
      <section className="bg-charcoal text-cream pt-36 pb-24 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-6">Our Story</div>
        <h1 className="font-serif font-light text-[clamp(40px,6vw,72px)] leading-[1.1] max-w-3xl mx-auto">
          The love was still there.<br/><em>Life just got busy.</em>
        </h1>
      </section>

      <section className="bg-cream py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="relative md:sticky md:top-28">
            <img src={about1} alt="Founder" width={1024} height={1280} className="w-4/5 aspect-[3/4] object-cover" />
            <img src={about2} alt="Quiet morning" width={1024} height={1024} className="absolute right-0 -bottom-10 w-3/5 aspect-square object-cover border-[6px] border-cream" />
          </div>
          <div className="md:pt-4 space-y-5 text-warm-gray leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 8 || i === 14 ? "font-serif italic text-xl text-burgundy leading-snug" : ""}>{p}</p>
            ))}
            <Link to="/kit" className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)] mt-8 inline-flex hover:!bg-[color:var(--color-burgundy)] hover:!text-cream">Get Your Date Night Kit — £39.99</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
