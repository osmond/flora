import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const userId = Deno.env.get("NEXT_PUBLIC_SINGLE_USER_ID") ?? "flora-single-user";

const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async () => {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("tasks")
    .select("type, plant:plants(nickname)")
    .lte("due_date", today)
    .is("completed_at", null)
    .eq("user_id", userId);

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
});
