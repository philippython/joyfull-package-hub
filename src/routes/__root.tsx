import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl text-burgundy-deep">404</h1>
        <p className="mt-4 text-warm-gray">This page seems to have drifted away.</p>
        <Link to="/" className="btn-primary mt-8 inline-block">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl text-burgundy-deep">Something interrupted us</h1>
        <p className="mt-2 text-sm text-warm-gray">Please try again in a moment.</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-primary mt-6"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rewindd — Date Night Ritual Kit for Couples Who Still Love Each Other" },
      {
        name: "description",
        content:
          "A premium reconnection ritual for busy couples. One quiet evening to come home to each other.",
      },
      {
        property: "og:title",
        content: "Rewindd — Date Night Ritual Kit for Couples Who Still Love Each Other",
      },
      {
        property: "og:description",
        content:
          "A premium reconnection ritual for busy couples. One quiet evening to come home to each other.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Rewindd — Date Night Ritual Kit for Couples Who Still Love Each Other",
      },
      {
        name: "twitter:description",
        content:
          "A premium reconnection ritual for busy couples. One quiet evening to come home to each other.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/424e9d09-4b45-4020-a3e3-bdf83bc5ad07/id-preview-1f55b415--cc86f514-05e3-432e-9b07-f7c1a4020c07.lovable.app-1780008954745.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/424e9d09-4b45-4020-a3e3-bdf83bc5ad07/id-preview-1f55b415--cc86f514-05e3-432e-9b07-f7c1a4020c07.lovable.app-1780008954745.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Meta Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','977192161900059');fbq('track','PageView');`,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=977192161900059&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Only fires on meaningful auth transitions: sign in and sign out.
// Avoids triggering on TOKEN_REFRESHED or INITIAL_SESSION which caused
// the infinite invalidate → getUser 401 → auth event → invalidate loop.
const MEANINGFUL_EVENTS = new Set(["SIGNED_IN", "SIGNED_OUT"]);

function AuthSync() {
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!MEANINGFUL_EVENTS.has(event)) return;

      // On sign-in: invalidate auth-gated queries so admin data reloads
      if (event === "SIGNED_IN") {
        qc.invalidateQueries({ queryKey: ["isAdmin"] });
        qc.invalidateQueries({ queryKey: ["adminProducts"] });
        qc.invalidateQueries({ queryKey: ["adminOrders"] });
        qc.invalidateQueries({ queryKey: ["myOrders"] });
        router.invalidate();
      }

      // On sign-out: clear everything and go home
      if (event === "SIGNED_OUT") {
        qc.clear();
        router.invalidate();
      }
    });
    return () => subscription.unsubscribe();
  }, [router, qc]);

  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
}
