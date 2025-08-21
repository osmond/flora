import { createClient } from "@supabase/supabase-js";
import AddNoteForm from "@/components/AddNoteForm";
import AddPhotoForm from "@/components/AddPhotoForm";
import CareTimeline from "@/components/CareTimeline";
import Link from "next/link";
import { getCurrentUserId } from "@/lib/auth";

export const revalidate = 0;

type CarePlan = {
  waterEvery?: string;
  fertEvery?: string;
  fertFormula?: string;
  rationale?: string;
  weather?: {
    temperature?: number;
    humidity?: number;
  };
  climateZone?: string;
};

type Plant = {
  id: string;
  name: string;
  species: string | null;
  common_name: string | null;
  pot_size: string | null;
  pot_material: string | null;
  drainage: string | null;
  soil_type: string | null;
  image_url: string | null;
  indoor: string | null;
  care_plan: CarePlan | null;
};

type PlantEvent = {
  id: string;
  type: string;
  note: string | null;
  image_url: string | null;
  created_at: string;
};

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: plant, error: plantError } = await supabase
    .from("plants")
    .select(
      "id, name, species, common_name, pot_size, pot_material, drainage, soil_type, image_url, indoor, care_plan",
    )
    .eq("id", id)
    .eq("user_id", getCurrentUserId())
    .single<Plant>();

  if (plantError || !plant) {
    console.error("Error fetching plant:", plantError?.message);
    return <div>Failed to load plant.</div>;
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, type, note, image_url, created_at")
    .eq("plant_id", id)
    .order("created_at", { ascending: false });

  const timeline = events as PlantEvent[] | null;
  const notes = timeline?.filter((e) => e.type === "note") || [];
  const photoEvents =
    timeline?.filter((e) => e.type === "photo" && e.image_url) || [];
  const otherEvents =
    timeline?.filter((e) => e.type !== "note" && e.type !== "photo") || [];

  const lastWaterEvent = otherEvents.find((e) => e.type === "water") || null;
  const lastWatered = lastWaterEvent
    ? new Date(lastWaterEvent.created_at)
    : null;
  let nextWaterDue: Date | null = null;
  if (lastWatered && plant.care_plan?.waterEvery) {
    const match = plant.care_plan.waterEvery.match(/(\d+)/);
    if (match) {
      const days = parseInt(match[1], 10);
      nextWaterDue = new Date(lastWatered);
      nextWaterDue.setDate(nextWaterDue.getDate() + days);
    }
  }

  let careSuggestion: string | null = null;
  if (nextWaterDue && nextWaterDue < new Date()) {
    careSuggestion = `This plant was due for watering on ${nextWaterDue.toLocaleDateString()}. Consider giving it a drink.`;
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        {plant.image_url ? (
          <div className="relative mb-4">
            <img
              src={plant.image_url}
              alt={plant.name}
              className="h-48 w-full rounded object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4">
              <h1 className="text-2xl font-bold text-white">{plant.name}</h1>
              {plant.common_name && (
                <p className="text-sm text-white">{plant.common_name}</p>
              )}
              {plant.species && (
                <p className="text-xs italic text-gray-200">{plant.species}</p>
              )}
            </div>
          </div>
        ) : (
          <h1 className="mb-4 text-2xl font-bold">{plant.name}</h1>
        )}
        {plant.pot_size && (
          <p className="text-sm text-gray-600">Pot size: {plant.pot_size}</p>
        )}
        {plant.pot_material && (
          <p className="text-sm text-gray-600">
            Pot material: {plant.pot_material}
          </p>
        )}
        {plant.drainage && (
          <p className="text-sm text-gray-600">Drainage: {plant.drainage}</p>
        )}
        {plant.soil_type && (
          <p className="text-sm text-gray-600">Soil type: {plant.soil_type}</p>
        )}
        {plant.indoor && (
          <p className="text-sm text-gray-600">Location: {plant.indoor}</p>
        )}
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Quick Stats</h2>
          <Link href={`/plants/${plant.id}/edit`} className="text-sm text-green-700 hover:underline">Edit</Link>
        </div>
        {plant.care_plan ? (
          <ul className="space-y-1 text-sm">
            {plant.care_plan.waterEvery && (
              <li>
                <span className="font-medium">Water every:</span> {plant.care_plan.waterEvery}
                {lastWatered && (
                  <span className="block text-gray-500">
                    Last watered: {lastWatered.toLocaleDateString()}
                    {nextWaterDue && ` (next due ${nextWaterDue.toLocaleDateString()})`}
                  </span>
                )}
              </li>
            )}
            {plant.care_plan.fertEvery && (
              <li>
                <span className="font-medium">Fertilize every:</span> {plant.care_plan.fertEvery}
                {plant.care_plan.fertFormula && (
                  <span className="block text-gray-500">
                    {plant.care_plan.fertFormula}
                  </span>
                )}
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-gray-600">No care plan.</p>
        )}
      </section>

      {careSuggestion && (
        <section className="rounded border-l-4 border-green-600 bg-green-50 p-4 text-sm text-green-700">
          <h2 className="mb-1 font-semibold">Care Coach</h2>
          <p>{careSuggestion}</p>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="mb-2 font-semibold">Photo Gallery</h2>
        <AddPhotoForm plantId={plant.id} />
        {photoEvents.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {photoEvents.map((evt) => (
              <div key={evt.id}>
                {evt.image_url && (
                  <img
                    src={evt.image_url}
                    alt={plant.name}
                    className="h-32 w-full rounded object-cover"
                  />
                )}
                {evt.note && (
                  <div className="text-xs text-gray-600">{evt.note}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No photos yet.</p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="mb-2 font-semibold">Notes</h2>
        <AddNoteForm plantId={plant.id} />
        {notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((evt) => (
              <li key={evt.id} className="rounded border p-2">
                <div className="text-sm text-gray-500">
                  {new Date(evt.created_at).toLocaleString()}
                </div>
                {evt.note && <div className="text-sm">{evt.note}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes yet.</p>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Timeline</h2>
        <CareTimeline events={timeline ?? []} />
        {otherEvents.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {otherEvents.map((evt) => (
              <li key={evt.id} className="rounded border p-2">
                <div className="text-sm text-gray-500">
                  {new Date(evt.created_at).toLocaleString()}
                </div>
                <div className="font-medium">{evt.type}</div>
                {evt.note && <div className="text-sm">{evt.note}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4">No events logged yet.</p>
        )}
      </section>
    </div>
  );
}
