import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";

export async function getAiCareSuggestions(plantId: string) {
  const userId = getCurrentUserId();
  const today = new Date().toISOString().slice(0, 10);

  const { data: tasks, error } = await supabaseAdmin
    .from("tasks")
    .select("type, due_date")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .is("completed_at", null)
    .lte("due_date", today);

  if (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Failed to fetch tasks");
  }

  const suggestions: string[] = [];
  tasks?.forEach((t) => {
    suggestions.push(`Looks overdue for ${t.type}.`);
  });

  try {
    const lat = process.env.WEATHER_LAT ?? "40.71";
    const lon = process.env.WEATHER_LON ?? "-74.01";
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,et0_fao_evapotranspiration&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const precip = data.daily?.precipitation_probability_max?.[0];
      if (typeof precip === "number" && precip > 70) {
        suggestions.push("High chance of rain today, adjust watering.");
      }
    }
  } catch {
    // ignore weather errors
  }

  if (suggestions.length === 0) {
    suggestions.push("All good! \uD83C\uDF3F");
  }

  return suggestions;
}
