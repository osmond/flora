import ForecastClient from "@/components/ForecastClient";
import type { Plant } from "@/lib/tasks";

async function getPlants(): Promise<Plant[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, anon);
    const { data } = await supabase
      .from("plants")
      .select("id, nickname, water_every, fert_every, last_watered_at, last_fertilized_at");
    if (!data) return [];
    return (data as any[]).map((p) => ({
      id: String(p.id),
      nickname: p.nickname,
      waterEvery: p.water_every ?? null,
      fertEvery: p.fert_every ?? null,
      lastWateredAt: p.last_watered_at ?? null,
      lastFertilizedAt: p.last_fertilized_at ?? null,
    }));
  } catch {
    return [];
  }
}

export default async function ForecastPage() {
  const plants = await getPlants();
  return (
    <section className="space-y-4 px-4 py-6 md:px-6">
      <div>
        <h1 className="text-2xl font-semibold">Weekly Care Forecast</h1>
        <p className="text-sm text-muted-foreground">Plan your week with weather and care tasks.</p>
      </div>
      {plants.length === 0 ? (
        <p className="text-sm text-muted-foreground">No plants yet. Add some to see a forecast.</p>
      ) : (
        <ForecastClient plants={plants} />
      )}
    </section>
  );
}
