import { createClient } from "@supabase/supabase-js";
import AddNoteForm from "@/components/AddNoteForm";

export const revalidate = 0;

type Plant = {
  id: string;
  name: string;
  species: string | null;
  common_name: string | null;
};

type PlantEvent = {
  id: string;
  type: string;
  note: string | null;
  created_at: string;
};

export default async function PlantDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: plant, error: plantError } = await supabase
    .from("plants")
    .select("id, name, species, common_name")
    .eq("id", params.id)
    .single<Plant>();

  if (plantError || !plant) {
    console.error("Error fetching plant:", plantError?.message);
    return <div>Failed to load plant.</div>;
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, type, note, created_at")
    .eq("plant_id", params.id)
    .order("created_at", { ascending: false });

  const timeline = events as PlantEvent[] | null;
  const notes = timeline?.filter((e) => e.type === "note") || [];
  const otherEvents = timeline?.filter((e) => e.type !== "note") || [];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">{plant.name}</h1>
        {plant.common_name && (
          <p className="text-gray-600">{plant.common_name}</p>
        )}
        {plant.species && (
          <p className="text-sm italic text-gray-600">{plant.species}</p>
        )}
      </div>

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

