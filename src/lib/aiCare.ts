import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";

export interface CareContext {
  events: { type: string; note: string | null; created_at: string }[];
  weather: {
    tempMax?: number;
    tempMin?: number;
    precipitationChance?: number;
  } | null;
}

export async function getAiCareContext(plantId: string): Promise<CareContext> {
  const userId = await getCurrentUserId();
  const { data: events } = await supabaseAdmin
    .from("events")
    .select("type, note, created_at")
    .eq("user_id", userId)
    .eq("plant_id", plantId)
    .order("created_at", { ascending: false })
    .limit(20);

  let weather: CareContext["weather"] = null;
  try {
    const lat = process.env.WEATHER_LAT ?? "40.71";
    const lon = process.env.WEATHER_LON ?? "-74.01";
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      weather = {
        tempMax: data.daily?.temperature_2m_max?.[0],
        tempMin: data.daily?.temperature_2m_min?.[0],
        precipitationChance: data.daily?.precipitation_probability_max?.[0],
      };
    }
  } catch {
    // ignore weather errors
  }

  return { events: events ?? [], weather };
}

export async function getAiCareSuggestions(plantId: string) {
  const userId = await getCurrentUserId();
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

  const { weather, events } = await getAiCareContext(plantId);
  if (
    weather &&
    typeof weather.precipitationChance === "number" &&
    weather.precipitationChance > 70
  ) {
    suggestions.push("High chance of rain today, adjust watering.");
  }
  if (events.length === 0) {
    suggestions.push(
      "No care history yet. Start logging events to get better suggestions.",
    );
  }

  if (suggestions.length === 0) {
    suggestions.push("All good! \uD83C\uDF3F");
  }

  return suggestions;
}
