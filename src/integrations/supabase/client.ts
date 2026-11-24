// Compatibility export for Lovable-generated integrations.
// The application has one browser Supabase client in src/lib/supabase.ts.
import { getSupabaseClient } from "@/lib/supabase";

export const supabase = new Proxy({} as ReturnType<typeof getSupabaseClient>, {
  get(_target, property, receiver) {
    const client = getSupabaseClient();
    return Reflect.get(client, property, receiver);
  },
});
