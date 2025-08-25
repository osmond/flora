import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client authenticated with the service role key.
 *
 * This client has elevated privileges and should only be used in secure
 * server-side environments such as API routes. If environment variables are
 * missing, a dummy client is created for tests.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "service-role-key",
);

