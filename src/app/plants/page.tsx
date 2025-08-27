import PlantCard, { type PlantCardProps } from "@/components/PlantCard";
import EmptyState from "@/components/EmptyState";
import PlantsGrid from "@/components/PlantsGrid";
import {
  type PlantRow,
  fallbackPlants,
} from "@/lib/fallbackPlants";

function rowToProps(row: PlantRow): PlantCardProps {
  return {
    id: String(row.id),
    nickname: row.nickname,
    species: row.species ?? null,
    lastWateredAt: row.last_watered_at ?? null,
    lastFertilizedAt: row.last_fertilized_at ?? null,
    waterEvery: row.water_every ?? null,
    fertEvery: row.fert_every ?? null,
  };
}

async function getPlants(): Promise<PlantCardProps[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return fallbackPlants.map(rowToProps);

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, anon);
    const { data, error } = await supabase.from("plants").select("*");
    if (error || !data) return fallbackPlants.map(rowToProps);
    return (data as PlantRow[]).map(rowToProps);
  } catch {
    return fallbackPlants.map(rowToProps);
  }
}

export default async function PlantsPage() {
  const plants = await getPlants();

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <h1 className="text-2xl font-semibold">Plants</h1>
      {plants.length === 0 ? (
        <EmptyState
          title="Welcome to Flora"
          description="Track watering and care, add notes and photos, and keep your plants happy."
          ctaHref="/plants/new"
          ctaLabel="Add your first plant"
          hint="Pro tip: press A to add a plant"
        />
      ) : (
        <PlantsGrid items={plants} />
      )}
    </section>
  );
}
