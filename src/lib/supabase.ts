import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

export function isSupabaseConfigured() {
  return Boolean(
    import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  );
}

// Create the authenticated client only in the browser. The app uses SSR,
// so a module-level client could otherwise be shared between server requests.
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("O cliente Supabase só pode ser usado no navegador.");
  }

  if (!browserClient) {
    const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"];
    const supabasePublishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabasePublishableKey) {
      throw new Error(
        "Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY antes de usar o GAMBO.",
      );
    }

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
