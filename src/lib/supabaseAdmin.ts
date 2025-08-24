import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client authenticated with the service role key.
 *
 * This client has elevated privileges and should only be used in secure
 * server-side environments such as API routes. Environment variables are
 * expected to be configured with the Supabase project URL and service role key.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

