import { createClient } from "@supabase/supabase-js";

/**
 * Client-side Supabase instance using the public anon key.
 *
 * When environment variables are missing, falls back to dummy values so that
 * tests and Storybook can run without real credentials.
 */
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-key",
);

