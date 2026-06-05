import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Home", to: "/" as const },
  { label: "Kits", to: "/kit" as const },
  { label: "Our Story", to: "/our-story" as const },
  { label: "FAQ", to: "/faq" as const },
  { label: "Policies", to: "/policies" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors"
      style={{
        background: scrolled ? "rgba(13,10,8,0.95)" : "rgba(13,10,8,0.75)",
        borderColor: "rgba(200,168,107,0.18)",
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-10 py-4">
        <Link to="/" className="font-serif italic text-2xl tracking-wide text-gold" onClick={() => setOpen(false)}>
          Rewindd
        </Link>
        <ul className="hidden md:flex items-center gap-7 list-none">
          {NAV.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className="text-[11px] tracking-[0.18em] uppercase text-cream/75 hover:text-gold transition">
                {item.label}
              </Link>
            </li>
          ))}
          <li><Link to="/kit" className="btn-primary !py-2.5">Get the Kit</Link></li>
        </ul>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-[5px] p-2"
        >
          <span className="block w-5 h-px bg-gold" />
          <span className="block w-5 h-px bg-gold" />
          <span className="block w-5 h-px bg-gold" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-gold/15 bg-[rgba(13,10,8,0.98)] px-6 py-6">
          <ul className="flex flex-col gap-4 list-none">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block text-[12px] tracking-[0.18em] uppercase text-cream/85 hover:text-gold transition py-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link to="/kit" onClick={() => setOpen(false)} className="btn-primary w-full text-center !block">Get the Kit</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[color:var(--color-charcoal)] text-cream/70 px-6 md:px-12 pt-20 pb-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="font-serif italic text-2xl text-gold mb-3">Rewindd</div>
          <p className="text-[13px] leading-relaxed text-cream/55 max-w-xs">
            For couples who still love each other, but miss spending quality time together.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-[13px] list-none">
            <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link to="/kit" className="hover:text-gold transition">Date Night Kits</Link></li>
            <li><Link to="/our-story" className="hover:text-gold transition">Our Story</Link></li>
            <li><Link to="/faq" className="hover:text-gold transition">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Policies</h4>
          <ul className="space-y-2 text-[13px] list-none">
            <li><Link to="/policies" className="hover:text-gold transition">Shipping, Returns & Care</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Contact</h4>
          <p className="text-[13px] text-cream/55 leading-relaxed">
            <a href="mailto:rewindd2026@gmail.com" className="hover:text-gold transition">rewindd2026@gmail.com</a><br/>
            Hand-packed in small batches.<br/>Dispatched within 2–3 business days.
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-cream/10 pt-6 text-[11px] text-cream/40 flex flex-wrap justify-between gap-4">
        <span>© {new Date().getFullYear()} Rewindd. All rights reserved.</span>
        <span className="tracking-[0.2em] uppercase">Pause · Connect · Reignite</span>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main id="top">{children}</main>
      <SiteFooter />
    </>
  );
}
