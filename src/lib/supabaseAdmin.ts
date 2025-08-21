import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

declare global {
  var supabaseAdmin: SupabaseClient | undefined;
}

export const supabaseAdmin =
  globalThis.supabaseAdmin ??
  (globalThis.supabaseAdmin = createClient(url, serviceRole, {
    auth: { persistSession: false },
  }));
