import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as lovableSupabase } from "@/integrations/supabase/client";

export function getSupabaseConfig() {
  const url = (
    import.meta.env["VITE_SUPABASE_URL"] ||
    import.meta.env["SUPABASE_URL"] ||
    (typeof process !== "undefined" ? process.env["SUPABASE_URL"] : undefined) ||
    ""
  ).trim();

  const publishableKey = (
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    import.meta.env["SUPABASE_PUBLISHABLE_KEY"] ||
    (typeof process !== "undefined" ? process.env["SUPABASE_PUBLISHABLE_KEY"] : undefined) ||
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

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("O cliente Supabase só pode ser usado no navegador.");
  }

  if (!isSupabaseConfigured()) {
    try {
      return lovableSupabase as unknown as SupabaseClient;
    } catch (error) {
      throw new Error(
        "Configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY antes de usar o GAMBO.",
        { cause: error },
      );
    }
  }

  // Lovable owns the external-Supabase proxy. Returning it prevents two
  // browser clients and keeps Preview and published builds consistent.
  return lovableSupabase as unknown as SupabaseClient;
}
