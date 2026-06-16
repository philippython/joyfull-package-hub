import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
import coupleKitchen from "@/assets/our-story-couple.jpeg";
const paragraphs = [
  "Nobody really talks about marriages where nothing is wrong.",
  "You still love each other. You still care. You still show up every day.",
  "But somewhere between work, children, responsibilities and trying to keep life moving, quality time together quietly disappears.",
  "You still talk. But you're not really connecting the way you used to.",
  "And because you're not fighting, it's hard to explain.",
  "When I started looking for ways couples could reconnect, everything felt too extreme. Therapy. Relationship programmes. Fixing broken marriages.",
  "But that wasn't us. We didn't need fixing. We simply needed intentional time together again.",
  "Something simple. Something realistic. Something we could do from home without the pressure of planning a date night, finding a babysitter or spending a fortune.",
  "That idea became Rewindd.",
  "A simple invitation to slow down, put life on pause for a moment, and reconnect with the person you chose.",
  "Because love doesn't always need fixing. Sometimes it just needs time.",
];
export default function OurStoryPage() {
  return (
    <SiteLayout>
      <section className="bg-charcoal text-cream pt-28 pb-12 md:pt-36 md:pb-20 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-4">Our Story</div>
        <h1 className="font-serif font-light text-[clamp(32px,6vw,64px)] leading-[1.1] max-w-3xl mx-auto">The love was still there.<br /><em>Life just got busy.</em></h1>
      </section>
      <section className="bg-cream py-12 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-5 text-warm-gray leading-relaxed text-[15px] md:text-base">
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 4 || i === 8 ? "font-serif italic text-lg md:text-xl text-burgundy leading-snug" : ""}>{p}</p>
            ))}
          </div>
          <div className="mt-12 max-w-md mx-auto">
            <img src={coupleKitchen} alt="A couple sharing a quiet morning together" loading="lazy" className="w-full aspect-[3/4] object-cover" />
          </div>
          <div className="text-center mt-12">
            <Link to="/kit" className="btn-primary">Get Your Date Night Kit — £39.99</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
