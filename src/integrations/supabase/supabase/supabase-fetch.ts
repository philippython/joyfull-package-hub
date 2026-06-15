/**
 * Call this once at app startup (e.g. in your root component or entry file).
 * It patches the global fetch so that every TanStack Start server function
 * call automatically includes the Supabase session token as a Bearer header.
 *
 * Usage: import "@/integrations/supabase/supabase-fetch" at the top of your
 * root route or app entry point.
 */
import { supabase } from "./client";

const _fetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = async (input, init) => {
  // Only inject on same-origin server function calls (/_server or /api)
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
  const isSameSite =
    !url.startsWith("http") || url.includes(globalThis.location?.origin ?? "__NO_ORIGIN__");
  const isServerFn = url.includes("/_server") || url.includes("/api/");

  if (isSameSite || isServerFn) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) {
      init = {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          Authorization: `Bearer ${token}`,
        },
      };
    }
  }

  return _fetch(input, init);
};
