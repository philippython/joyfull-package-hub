import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/site-layout";
function Card({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="bg-white p-8 border border-burgundy/10 hover:border-gold transition-colors">
      <div className="font-serif text-xl text-burgundy-deep mb-3">{title}</div>
      <div className="text-sm text-warm-gray leading-relaxed">{body}</div>
    </div>
  );
}
export default function PoliciesPage() {
  return (
    <SiteLayout>
      <section className="bg-charcoal text-cream pt-36 pb-20 px-6 text-center">
        <div className="eyebrow justify-center !text-[color:var(--color-gold)] mb-5">Shipping, Returns & Care</div>
        <h1 className="font-serif font-light text-[clamp(36px,6vw,64px)] leading-[1.1] max-w-3xl mx-auto"><em>Everything</em> you need to know.</h1>
      </section>
      <section className="bg-ivory py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <Card title="Shipping & Delivery" body="Every Rewindd kit is carefully packed by hand and dispatched within 2–3 business days. You'll receive tracking details as soon as your order is on its way." />
          <Card title="UK Delivery Only" body="At this time, Rewindd is available for delivery within the United Kingdom only." />
          <Card title="Returns (14 Days)" body="We accept returns within 14 days of delivery. Items must be returned in their original condition. The buyer is responsible for the return shipping fee. For hygiene reasons, the massage oil seal must remain unopened and unbroken." />
          <Card title="Damaged on Arrival" body={<>If your order arrives damaged or incorrect, please email us within <strong>48 hours of delivery</strong> with photos at <a href="mailto:rewindd2026@gmail.com" className="text-burgundy underline">rewindd2026@gmail.com</a>. We'll arrange a replacement as quickly as possible.</>} />
          <Card title="Changing or Cancelling an Order" body="Need to update your delivery address or cancel your order? Please contact us within 2 hours of placing your order. Once your order has been processed, changes can no longer be made." />
          <Card title="Get in Touch" body={<>Questions, gifting enquiries or order support? <a href="mailto:rewindd2026@gmail.com" className="text-burgundy underline">rewindd2026@gmail.com</a>. We aim to respond within one business day.</>} />
        </div>
        <div className="text-center mt-14">
          <Link to="/kit" className="btn-primary">Get Your Date Night Kit — £39.99</Link>
        </div>
      </section>
    </SiteLayout>
  );
}
