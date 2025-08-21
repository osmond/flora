import { createClient } from "@supabase/supabase-js";
import AddNoteForm from "@/components/AddNoteForm";

export const revalidate = 0;

type CarePlan = {
  waterEvery?: string;
  fertEvery?: string;
  fertFormula?: string;
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
    .single<Plant>();

  if (plantError || !plant) {
    console.error("Error fetching plant:", plantError?.message);
    return <div>Failed to load plant.</div>;
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, type, note, created_at")
    .eq("plant_id", id)
    .order("created_at", { ascending: false });

  const timeline = events as PlantEvent[] | null;
  const notes = timeline?.filter((e) => e.type === "note") || [];
  const otherEvents = timeline?.filter((e) => e.type !== "note") || [];

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
        <h2 className="mb-2 font-semibold">Quick Stats</h2>
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
        {otherEvents.length > 0 ? (
          <ul className="space-y-2">
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
          <p>No events logged yet.</p>
        )}
      </section>
    </div>
  );
}
