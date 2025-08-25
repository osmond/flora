import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { format, addDays } from "date-fns";

interface Plant {
  id: string;
  water_every?: string | null;
  waterEvery?: string | null;
  fert_every?: string | null;
  fertEvery?: string | null;
}

interface QuickStatsProps {
  plant: Plant;
}

function parseInterval(value?: string | null) {
  if (!value) return null;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export default async function QuickStats({ plant }: QuickStatsProps) {
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

  const fmt = (d: Date | null) => (d ? format(d, "PP") : "—");

  return (
    <div className="mt-4 rounded border p-4">
      <h2 className="mb-2 text-lg font-semibold">Quick Stats</h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Water every</p>
          <p>{plant.water_every || plant.waterEvery || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Last watered</p>
          <p>{fmt(lastWaterDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Next watering</p>
          <p>{fmt(nextWaterDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Fertilize every</p>
          <p>{plant.fert_every || plant.fertEvery || "—"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Last fertilized</p>
          <p>{fmt(lastFertDate)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Next fertilizing</p>
          <p>{fmt(nextFertDate)}</p>
        </div>
      </div>
    </div>
  );
}
