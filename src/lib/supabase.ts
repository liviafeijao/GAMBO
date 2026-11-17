import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

// Create the authenticated client only in the browser. The app uses SSR,
// so a module-level client could otherwise be shared between server requests.
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("O cliente Supabase só pode ser usado no navegador.");
  }

  if (!browserClient) {
    const supabaseUrl =
      import.meta.env.VITE_SUPABASE_URL ??
      "https://fgxdzvlonocddtimkoaw.supabase.co";

    const supabasePublishableKey =
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
      "sb_publishable_xLbeOIkYcOtTSKG85OFsCg_PYk163OJ";

    browserClient = createClient(supabaseUrl, supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return browserClient;
}
