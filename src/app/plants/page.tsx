import PlantCard, { type PlantCardProps } from "@/components/PlantCard";
import EmptyState from "@/components/EmptyState";
import PlantsGrid from "@/components/PlantsGrid";
import QuickAddDialog from "@/components/plant/QuickAddDialog";
import type { PlantRow } from "@/lib/fallbackPlants";
import { isDemoMode } from "@/lib/server-demo";
import { getDemoPlants } from "@/lib/demoData";
import { fallbackPlants } from "@/lib/fallbackPlants";

function rowToProps(row: PlantRow | any): PlantCardProps {
  return {
    id: String(row.id),
    nickname: row.nickname,
    species: row.species ?? row.species_common ?? row.speciesScientific ?? null,
    lastWateredAt: row.last_watered_at ?? null,
    lastFertilizedAt: row.last_fertilized_at ?? null,
    waterEvery: row.water_every ?? row.care_plan?.water_every ?? null,
    fertEvery: row.fert_every ?? row.care_plan?.fert_every ?? null,
  };
}

async function getPlants(): Promise<(PlantCardProps & { roomName?: string | null })[]> {
  if (await isDemoMode()) return getDemoPlants().map(rowToProps);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, anon);
    const { data: plants } = await supabase
      .from("plants")
      .select("id, nickname, species_common, image_url, room_id, water_every, fert_every, care_plan, last_watered_at, last_fertilized_at");
    const { data: rooms } = await supabase.from("rooms").select("id, name");
    const roomMap = new Map<string, string>();
    (rooms || []).forEach((r: any) => roomMap.set(String(r.id), r.name));
    return (plants || []).map((row: any) => ({
      ...rowToProps(row as any),
      roomName: row.room_id ? roomMap.get(String(row.room_id)) ?? null : null,
    }));
  } catch {
    return [];
  }
}

export default async function PlantsPage() {
  const plants = await getPlants();
  const groups = new Map<string, (typeof plants)[number][]>();
  for (const p of plants) {
    const key = p.roomName ?? "Unassigned";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plants</h1>
        <QuickAddDialog />
      </div>
      {plants.length === 0 ? (
        <EmptyState
          title="Welcome to Flora"
          description="Track watering and care, add notes and photos, and keep your plants happy."
          ctaHref="/plants/new"
          ctaLabel="Add your first plant"
          hint="Pro tip: press A to add a plant"
        />
      ) : (
        <div className="space-y-8">
          {Array.from(groups.entries()).map(([room, items]) => (
            <div key={room}>
              <h2 className="mb-3 text-lg font-medium">{room}</h2>
              <PlantsGrid items={items} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
