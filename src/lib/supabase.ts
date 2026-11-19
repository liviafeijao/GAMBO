import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

function getSupabaseConfig() {
  const url = (
    import.meta.env["VITE_SUPABASE_URL"] ||
    import.meta.env["SUPABASE_URL"] ||
    ""
  ).trim();
  const publishableKey = (
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env["SUPABASE_PUBLISHABLE_KEY"] ||
    ""
  ).trim();

  return { url, publishableKey };
}

export function isSupabaseConfigured() {
  const { url, publishableKey } = getSupabaseConfig();

  return Boolean(
    url &&
    publishableKey &&
    url !== "https://your-project.supabase.co" &&
    publishableKey !== "your_supabase_publishable_key" &&
    /^https?:\/\//.test(url),
  );
}

// Create the authenticated client only in the browser. The app uses SSR,
// so a module-level client could otherwise be shared between server requests.
export function getSupabaseClient() {
  if (typeof window === "undefined") {
    throw new Error("O cliente Supabase só pode ser usado no navegador.");
  }

  if (!browserClient) {
    const { url: supabaseUrl, publishableKey: supabasePublishableKey } = getSupabaseConfig();

    if (!isSupabaseConfigured()) {
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
