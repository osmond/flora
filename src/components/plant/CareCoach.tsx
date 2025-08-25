import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { addDays } from "date-fns";

interface Plant {
  id: string;
  water_every?: string | null;
  waterEvery?: string | null;
  fert_every?: string | null;
  fertEvery?: string | null;
  humidity?: string | null;
}

interface CareCoachProps {
  plant: Plant;
}

function parseInterval(value?: string | null) {
  if (!value) return null;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export default async function CareCoach({ plant }: CareCoachProps) {
  const userId = await getCurrentUserId();
  const { data: waterEvents } = await supabaseAdmin
    .from("events")
    .select("created_at")
    .eq("plant_id", plant.id)
    .eq("user_id", userId)
    .eq("type", "water")
    .order("created_at", { ascending: false })
    .limit(1);

  const { data: fertEvents } = await supabaseAdmin
    .from("events")
    .select("created_at")
    .eq("plant_id", plant.id)
    .eq("user_id", userId)
    .eq("type", "fertilize")
    .order("created_at", { ascending: false })
    .limit(1);

  const lastWaterDate = waterEvents?.[0]?.created_at
    ? new Date(waterEvents[0].created_at as string)
    : null;
  const lastFertDate = fertEvents?.[0]?.created_at
    ? new Date(fertEvents[0].created_at as string)
    : null;

  const waterInterval = parseInterval(plant.water_every || plant.waterEvery);
  const fertInterval = parseInterval(plant.fert_every || plant.fertEvery);

  const nextWaterDate =
    lastWaterDate && waterInterval
      ? addDays(lastWaterDate, waterInterval)
      : null;
  const nextFertDate =
    lastFertDate && fertInterval ? addDays(lastFertDate, fertInterval) : null;

  const suggestions: string[] = [];

  if (plant.humidity && plant.humidity.toLowerCase() === "low") {
    suggestions.push("You may want to water early due to low humidity.");
  }

  if (nextWaterDate && nextWaterDate < new Date()) {
    suggestions.push("Looks overdue for watering.");
  }

  if (nextFertDate && nextFertDate < new Date()) {
    suggestions.push("Time to fertilize soon.");
  }

  if (suggestions.length === 0) {
    suggestions.push("All good! 🌿");
  }

  return (
    <div className="mt-4 rounded border bg-muted/50 p-4">
      <h2 className="mb-2 text-lg font-semibold">Care Coach</h2>
      <ul className="list-disc pl-5 text-sm">
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
