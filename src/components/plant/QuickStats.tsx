import { addDays, formatDistanceToNow } from "date-fns";
import { getCurrentUserId } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import StatPill from "./StatPill";

interface Plant {
  id: string;
  waterEvery?: string | null;
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

  const lastWaterDate = waterEvents?.[0]?.created_at
    ? new Date(waterEvents[0].created_at as string)
    : null;

  const waterInterval = parseInterval(plant.waterEvery);

  const nextWaterDate =
    lastWaterDate && waterInterval
      ? addDays(lastWaterDate, waterInterval)
      : null;

  const fmt = (d: Date | null) =>
    d ? formatDistanceToNow(d, { addSuffix: true }) : "—";

  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      <StatPill icon="💧" label="Last watered" value={fmt(lastWaterDate)} />
      <StatPill icon="⏭️" label="Next due" value={fmt(nextWaterDate)} />
      <StatPill
        icon="🔁"
        label="Water every"
        value={plant.waterEvery ?? "—"}
      />
    </div>
  );
}

