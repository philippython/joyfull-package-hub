import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site-layout";
import about1 from "@/assets/about-1.jpg";
import about2 from "@/assets/about-2.jpg";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Rewindd" },
      { name: "description", content: "Rewindd was built by two people who almost drifted apart. Here's how we came back." },
      { property: "og:title", content: "Our Story — Rewindd" },
      { property: "og:description", content: "Built for the couples who still love each other deeply." },
    ],
  }),
  component: OurStory,
});

function OurStory() {
  return (
    <SiteLayout>
      <section className="bg-charcoal text-cream pt-36 pb-24 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-6">Our Story</div>
        <h1 className="font-serif font-light text-[clamp(44px,7vw,80px)] leading-[1.1] max-w-3xl mx-auto">
          The love was always <em>there.</em><br/>We just had to listen for it.
        </h1>
      </section>

      <section className="bg-cream py-28 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="relative">
            <img src={about1} alt="Founders at home" width={1024} height={1280} className="w-4/5 aspect-[3/4] object-cover" />
            <img src={about2} alt="Journal and coffee" width={1024} height={1024} className="absolute right-0 -bottom-10 w-3/5 aspect-square object-cover border-[6px] border-cream" />
          </div>
          <div className="md:pt-4 space-y-5 text-warm-gray leading-relaxed">
            <p className="font-serif italic text-xl text-charcoal leading-snug">
              We didn't make Rewindd because we were experts. We made it because we needed it.
            </p>
            <p>For most of 2023, we were the busiest, most tired version of ourselves. Two careers, two kids, a house that always needed something. We loved each other. We just rarely <em>met</em> each other.</p>
            <p>One Tuesday we put the phones in another room, lit a candle, and asked a few of the questions we used to ask in our twenties. We talked until 1am. We cried a little. We remembered.</p>
            <p>The next week we made a box of that night for our closest friends. Then their friends. Now it's this.</p>
            <p>Rewindd isn't therapy. It isn't a fix. It's an invitation — to set down the noise, sit across from the person you chose, and choose them again.</p>
            <div className="pt-6">
              <div className="font-serif italic text-2xl text-burgundy">— Sara & Daniel</div>
              <div className="text-[11px] tracking-[0.2em] uppercase text-gold mt-2">Founders, Rewindd</div>
            </div>
            <Link to="/kit" className="btn-outline !text-[color:var(--color-burgundy)] !border-[color:var(--color-burgundy)] mt-8 inline-flex hover:!bg-[color:var(--color-burgundy)] hover:!text-cream">Order the Kit</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
