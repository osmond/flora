import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

type Plant = {
  id: string;
  name: string;
  room: string | null;
  species: string | null;
  common_name: string | null;
};

export default async function PlantsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("plants")
    .select("id, name, room, species, common_name")
    .order("room")
    .order("name");

  const plants = data as Plant[] | null;

  if (error) {
    console.error("Error fetching plants:", error.message);
    return <div>Failed to load plants.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Plants</h1>
      {plants && plants.length > 0 ? (
        Object.entries(
          plants.reduce((acc: Record<string, Plant[]>, plant) => {
            const room = plant.room || "Unassigned";
            acc[room] = acc[room] || [];
            acc[room].push(plant);
            return acc;
          }, {})
        ).map(([room, plants]) => (
          <section key={room} className="mb-8">
            <h2 className="mb-2 text-xl font-semibold">{room}</h2>
            <ul className="space-y-4">
              {plants.map((plant) => (
                <li key={plant.id}>
                  <Link
                    href={`/plants/${plant.id}`}
                    className="block rounded border p-4"
                  >
                    <div className="font-semibold">{plant.name}</div>
                    {plant.common_name && (
                      <div className="text-sm text-gray-600">
                        {plant.common_name}
                      </div>
                    )}
                    {plant.species && (
                      <div className="text-sm italic text-gray-600">
                        {plant.species}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      ) : (
        <p>No plants saved yet.</p>
      )}
    </div>
  );
}

