import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { SiteLayout } from "@/components/site-layout";
import { getProductBySlug } from "@/lib/api";
import { formatCents } from "@/lib/format";
import OrderForm from "@/components/order-form";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import flatlay from "@/assets/photo-flatlay.webp";
import openBox from "@/assets/photo-open-box.webp";
import boxImg from "@/assets/photo-box.jpg";
import cardImg from "@/assets/photo-card.jpg";
import coupleCards from "@/assets/photo-couple-cards.webp";
import coupleMask from "@/assets/photo-couple-mask.jpg";
import detail1 from "@/assets/photo-detail-1.avif";
import detail2 from "@/assets/photo-detail-2.avif";
import detail3 from "@/assets/photo-detail-3.avif";
import detail4 from "@/assets/photo-detail-4.avif";

const galleryImages = [flatlay, openBox, cardImg, detail1, detail2, detail3, boxImg, coupleCards, coupleMask, detail4];

function normalizeImageUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^data:/i.test(trimmed) || /^https?:\/\//i.test(trimmed) || trimmed.startsWith("/")) return trimmed;
  return `/assets/${trimmed}`;
}

function ProductCarousel({ images }: { images: string[] }) {
  const [api, setApi] = useState<any>();
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    api.on("select", () => setSelected(api.selectedScrollSnap()));
  }, [api]);
  return (
    <div className="space-y-3">
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {images.map((src, i) => (
            <CarouselItem key={i}><div className="aspect-square overflow-hidden bg-white"><img src={src} alt={`Product photo ${i + 1}`} className="w-full h-full object-cover" /></div></CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3" />
        <CarouselNext className="right-3" />
      </Carousel>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button key={i} onClick={() => api?.scrollTo(i)} className={`min-w-[5rem] aspect-square overflow-hidden border-2 transition ${selected === i ? "border-gold" : "border-transparent opacity-70 hover:opacity-100"}`}>
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KitDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useQuery({ queryKey: ["product", slug], queryFn: () => getProductBySlug(slug!) });
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (isLoading) return <SiteLayout><div className="min-h-[60vh] pt-32 px-6 text-center text-warm-gray">Loading…</div></SiteLayout>;
  if (!product) return (
    <SiteLayout>
      <div className="min-h-[60vh] pt-32 px-6 text-center">
        <h1 className="font-serif text-3xl text-burgundy-deep">Kit not found</h1>
        <Link to="/kit" className="btn-primary mt-6 inline-block">Browse Kits</Link>
      </div>
    </SiteLayout>
  );

  const items = (product.items_included as string[] | null) ?? [];
  const imageUrls = Array.isArray(product.image_urls) ? (product.image_urls as string[]).filter((u) => typeof u === "string" && u.trim()).map(normalizeImageUrl) : [];
  const productImages = imageUrls.length ? imageUrls.slice(0, 10) : product.image_url ? [normalizeImageUrl(product.image_url), ...galleryImages] : galleryImages;

  return (
    <SiteLayout>
      <section className="pt-32 pb-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <ProductCarousel images={productImages} />
          <div className="md:pt-4">
            <div className="eyebrow">{product.tagline || "Date Night Kit"}</div>
            <h1 className="font-serif font-light text-[clamp(32px,4.5vw,48px)] leading-[1.1] text-charcoal mt-4">{product.name}</h1>
            <div className="mt-6 font-serif text-4xl text-burgundy-deep">{formatCents(product.price_cents, product.currency)}</div>
            <ul className="mt-5 space-y-1.5 text-sm text-charcoal list-none">
              <li className="flex gap-2"><span className="text-gold">✓</span> UK Delivery Only</li>
              <li className="flex gap-2"><span className="text-gold">✓</span> Dispatched in 2–3 Business Days</li>
              <li className="flex gap-2"><span className="text-gold">✓</span> Gift-Ready Packaging</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => setCheckoutOpen(true)} className="btn-primary">Add to Cart</button>
              <button onClick={() => navigate(`/checkout?slug=${product.slug}`)} className="btn-outline">Buy Now</button>
            </div>
            <div className="mt-10 space-y-4 text-warm-gray leading-relaxed text-[15px] whitespace-pre-line">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </section>
      {items.length > 0 && (
        <section className="bg-[color:var(--color-burgundy-deep)] text-cream px-6 py-24">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <div className="eyebrow !text-[color:var(--color-gold)] justify-center">Inside Your Kit</div>
              <h2 className="section-title !text-cream mt-4">Everything arrives <em>beautifully packaged.</em></h2>
            </div>
            <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
              <img src={openBox} alt="Open Rewindd kit" className="w-full aspect-[4/5] object-cover" />
              <ul className="space-y-4 list-none">
                {items.map((it) => <li key={it} className="flex gap-3 text-cream/80 text-[15px] leading-relaxed border-b border-gold/15 pb-4"><span className="text-gold mt-0.5">◆</span><span>{it}</span></li>)}
              </ul>
            </div>
          </div>
        </section>
      )}
      <section id="checkout" className="py-24 px-6 bg-cream border-t border-burgundy/10">
        <div className="max-w-2xl mx-auto">
          {!checkoutOpen ? (
            <div className="text-center">
              <h2 className="section-title">Ready to <em>order?</em></h2>
              <button onClick={() => setCheckoutOpen(true)} className="btn-primary mt-8">Add to Cart</button>
            </div>
          ) : (
            <OrderForm productId={product.id} priceCents={product.price_cents} currency={product.currency} />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
