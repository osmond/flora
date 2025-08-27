import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig, SupabaseEnvError } from "@/lib/supabase/server";

/**
 * Server-side Supabase client authenticated with the service role key.
 */
export function supabaseAdmin() {
  const { url, key } = getSupabaseConfig();
  return createClient(url, key);
}

export { SupabaseEnvError } from "@/lib/supabase/server";
