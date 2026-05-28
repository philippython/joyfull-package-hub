import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { SiteLayout } from "@/components/site-layout";

export const Route = createFileRoute("/login")({
  validateSearch: (s) => z.object({ redirect: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Sign in — Rewindd" }] }),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: redirect || "/admin", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) navigate({ to: redirect || "/admin", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to verify.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth error");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error("Google sign-in failed");
  };

  const input = "w-full bg-white border border-burgundy/15 px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold";

  return (
    <SiteLayout>
      <section className="min-h-screen bg-cream pt-32 pb-20 px-6 flex justify-center">
        <div className="w-full max-w-md bg-white p-10 border-b-2 border-gold">
          <div className="eyebrow justify-center mb-4">{mode === "signin" ? "Welcome Back" : "Create Account"}</div>
          <h1 className="font-serif text-3xl text-burgundy-deep text-center">
            {mode === "signin" ? "Sign in" : "Join Rewindd"}
          </h1>
          <button onClick={google} className="mt-6 w-full border border-burgundy/20 py-3 text-sm hover:bg-cream transition">
            Continue with Google
          </button>
          <div className="my-5 text-center text-[11px] text-warm-gray tracking-widest uppercase">or</div>
          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={input} />}
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
            <input required type="password" minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
            <button type="submit" disabled={busy} className="btn-primary w-full mt-2 disabled:opacity-60">
              {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-6 w-full text-[11px] tracking-widest uppercase text-warm-gray hover:text-burgundy">
            {mode === "signin" ? "No account? Create one" : "Already have an account? Sign in"}
          </button>
          <Link to="/" className="block text-center text-[11px] tracking-widest uppercase text-warm-gray hover:text-burgundy mt-4">
            ← Back home
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
