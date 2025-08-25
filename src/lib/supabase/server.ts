import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client using the service role key.
 *
 * Defaults to localhost values when environment variables are missing so that
 * tests can run without real credentials.
 */
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "service-role-key",
    { auth: { persistSession: false } },
  );
}

