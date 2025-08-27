import EditPlantForm from "@/components/plant/EditPlantForm";
import { getFallbackPlant } from "@/lib/fallbackPlants";
import { isDemoMode } from "@/lib/server-demo";

async function getPlantForEdit(id: string) {
  if (await isDemoMode()) {
    const fb = getFallbackPlant(id);
    if (!fb) return null;
    return {
      id: String(fb.id),
      nickname: fb.nickname,
      speciesScientific: fb.species ?? null,
      imageUrl: null,
    };
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(url, anon);
      const { data } = await supabase
        .from("plants")
        .select("id, nickname, species_scientific, image_url, room_id")
        .eq("id", id)
        .maybeSingle();
      if (data) {
        return {
          id: String((data as any).id),
          nickname: (data as any).nickname,
          speciesScientific: (data as any).species_scientific ?? null,
          imageUrl: (data as any).image_url ?? null,
          roomId: (data as any).room_id ?? null,
        };
      }
    } catch {}
  }
  const fb = getFallbackPlant(id);
  return fb
    ? { id: String(fb.id), nickname: fb.nickname, speciesScientific: fb.species ?? null, imageUrl: null, roomId: null }
    : null;
}

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plant = await getPlantForEdit(id);
  if (!plant) {
    return <div className="p-6">Plant not found.</div>;
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <h1 className="text-2xl font-semibold">Edit Plant</h1>
        <EditPlantForm plant={plant} />
      </div>
    </main>
  );
}
