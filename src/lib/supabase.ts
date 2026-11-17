import { createClient } from "@supabase/supabase-js";

// A chave publishable é própria para aplicações frontend.
// Nunca substitua por uma chave secret ou service_role.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ??
  "https://fgxdzvlonocddtimkoaw.supabase.co";

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_xLbeOIkYcOtTSKG85OFsCg_PYk163OJ";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
