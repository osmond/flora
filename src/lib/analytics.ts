import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "./auth";
import config from "./config";

export async function logEvent(
  type: string,
  payload: Record<string, unknown> = {},
) {
  const url = config.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    config.SUPABASE_SERVICE_ROLE_KEY ?? config.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("Supabase credentials not set; analytics event not logged");
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("analytics_events").insert({
    user_id: getCurrentUserId(),
    type,
    payload,
  });

  if (error) {
    console.error("Error logging analytics event:", error.message);
  }
}
