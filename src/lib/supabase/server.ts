import { createClient } from "@supabase/supabase-js";

export class SupabaseEnvError extends Error {
  constructor(missing: string[]) {
    super(`Supabase environment variables missing: ${missing.join(", ")}`);
    this.name = "SupabaseEnvError";
  }
}

function getConfig(): { url: string; key: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missing: string[] = [];
  if (!url) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!key) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    throw new SupabaseEnvError(missing);
  }
  return { url: url as string, key: key as string };
}

/**
 * Server-side Supabase client using the service role key.
 */
export function supabaseServer() {
  const { url, key } = getConfig();
  return createClient(url, key, { auth: { persistSession: false } });
}

export { getConfig as getSupabaseConfig };
