import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const userId = Deno.env.get("NEXT_PUBLIC_SINGLE_USER_ID") ?? "flora-single-user";

const supabase = createClient(supabaseUrl, supabaseKey);

function withinQuietHours(start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  const now = new Date();
  const [sh, sm] = start.split(":" ).map(Number);
  const [eh, em] = end.split(":" ).map(Number);
  const startDate = new Date(now); startDate.setHours(sh, sm, 0, 0);
  const endDate = new Date(now); endDate.setHours(eh, em, 0, 0);
  if (startDate <= endDate) {
    return now >= startDate && now < endDate;
  }
  // Quiet hours span midnight
  return now >= startDate || now < endDate;
}

export async function handler() {
  const today = new Date().toISOString().slice(0, 10);

  const { data: settings } = await supabase
    .from("notification_settings")
    .select("quiet_start, quiet_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (withinQuietHours(settings?.quiet_start ?? null, settings?.quiet_end ?? null)) {
    return new Response(JSON.stringify({ message: "Within quiet hours" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("type, plant:plants(nickname, notifications_muted)")
    .lte("due_date", today)
    .is("completed_at", null)
    .eq("user_id", userId)
    .eq("plant.notifications_muted", false);

  if (error) {
    console.error("Error fetching tasks", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ message: "No tasks due" }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const counts: Record<string, number> = {};
  for (const task of data) {
    counts[task.type] = (counts[task.type] || 0) + 1;
  }

  const messages = Object.entries(counts).map(([type, count]) => {
    const plural = count === 1 ? "" : "s";
    return `${count} plant${plural} need${plural ? "" : "s"} ${type} today 🌿`;
  });

  for (const message of messages) {
    // Placeholder for real push notification integration
    console.log("Sending notification:", message);
  }

  return new Response(JSON.stringify({ sent: messages.length, messages }), {
    headers: { "Content-Type": "application/json" },
  });
}

if (import.meta.main) {
  Deno.serve(handler);
}
