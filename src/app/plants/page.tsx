import PlantCard, { type PlantCardProps } from "@/components/PlantCard";

type Row = {
  id: string;
  nickname: string;
  species?: string | null;
  lastWateredAt?: string | null;
  lastFertilizedAt?: string | null;
  waterEvery?: string | null;
  fertEvery?: string | null;
};

async function getPlants(): Promise<PlantCardProps[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return fallbackPlants;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, anon);
    const { data, error } = await supabase
      .from("plants")
      .select(
        "id, nickname, species, lastWateredAt:last_watered_at, lastFertilizedAt:last_fertilized_at, waterEvery:water_every, fertEvery:fert_every"
      );
    if (error || !data) return fallbackPlants;
    return (data as Row[]).map((r) => ({
      id: String(r.id),
      nickname: r.nickname,
      species: r.species ?? null,
      lastWateredAt: r.lastWateredAt ?? null,
      lastFertilizedAt: r.lastFertilizedAt ?? null,
      waterEvery: r.waterEvery ?? null,
      fertEvery: r.fertEvery ?? null,
    }));
  } catch {
    return fallbackPlants;
  }
}

const fallbackPlants: PlantCardProps[] = [
  {
    id: "1",
    nickname: "Monstera",
    species: "Deliciosa",
    waterEvery: "7 days",
    lastWateredAt: new Date(Date.now() - 8 * 86_400_000).toISOString(),
  },
  {
    id: "2",
    nickname: "Fiddle Leaf Fig",
    species: "Ficus lyrata",
    fertEvery: "30 days",
    lastFertilizedAt: new Date(
      Date.now() - 30 * 86_400_000
    ).toISOString(),
  },
  {
    id: "3",
    nickname: "Snake Plant",
    species: "Dracaena trifasciata",
    waterEvery: "14 days",
    lastWateredAt: new Date(
      Date.now() - 10 * 86_400_000
    ).toISOString(),
  },
];

export default async function PlantsPage() {
  const plants = await getPlants();

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <h1 className="text-2xl font-semibold">Plants</h1>
      {plants.length === 0 ? (
        <p className="text-sm text-muted-foreground">No plants yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plants.map((p) => (
            <PlantCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </section>
  );
}

