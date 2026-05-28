import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 backdrop-blur-md border-b transition-colors"
      style={{
        background: scrolled ? "rgba(13,10,8,0.92)" : "rgba(13,10,8,0.7)",
        borderColor: "rgba(200,168,107,0.18)",
      }}
    >
      <Link to="/" className="font-serif italic text-2xl tracking-wide text-gold">
        Rewindd
      </Link>
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li><Link to="/" className="text-[11px] tracking-[0.18em] uppercase text-cream/75 hover:text-gold transition">Home</Link></li>
        <li><Link to="/kit" className="text-[11px] tracking-[0.18em] uppercase text-cream/75 hover:text-gold transition">The Kit</Link></li>
        <li><Link to="/our-story" className="text-[11px] tracking-[0.18em] uppercase text-cream/75 hover:text-gold transition">Our Story</Link></li>
        {authed && (
          <li><Link to="/admin" className="text-[11px] tracking-[0.18em] uppercase text-cream/75 hover:text-gold transition">Account</Link></li>
        )}
        <li><Link to="/kit" className="btn-primary !py-2.5">Order Now</Link></li>
      </ul>
      <Link to="/kit" className="md:hidden btn-primary !py-2 !px-4 !text-[10px]">Order</Link>
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
            A premium reconnection ritual for the couples who still love each other deeply — but miss feeling truly close.
          </p>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Explore</h4>
          <ul className="space-y-2 text-[13px]">
            <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link to="/kit" className="hover:text-gold transition">The Kit</Link></li>
            <li><Link to="/our-story" className="hover:text-gold transition">Our Story</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Account</h4>
          <ul className="space-y-2 text-[13px]">
            <li><Link to="/login" className="hover:text-gold transition">Sign in</Link></li>
            <li><Link to="/admin" className="hover:text-gold transition">Orders & admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-[11px] tracking-[0.2em] uppercase text-gold mb-4">Stay close</h4>
          <p className="text-[13px] text-cream/55 leading-relaxed">
            Hand-packed in small batches. Shipped with care, anywhere.
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
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
