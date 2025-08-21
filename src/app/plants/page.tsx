import Link from "next/link";
import PlantList from "@/components/PlantList";
import { getPlants } from "@/lib/data";

export const revalidate = 0;

type Plant = {
  id: string;
  name: string;
  room: string | null;
  species: string | null;
  common_name: string | null;
  image_url: string | null;
};

export default async function PlantsPage() {
  let plants: Plant[] | null = null;
  try {
    plants = (await getPlants()) as Plant[] | null;
  } catch (error) {
    console.error("Error fetching plants:", error);
    return <div>Failed to load plants.</div>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Plants</h1>
      {plants && plants.length > 0 ? (
        <PlantList plants={plants} />
      ) : (
        <div className="text-center">
          <p className="mb-4">No plants saved yet.</p>
          <Link
            href="/add"
            className="inline-block rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
          >
            Add your first plant
          </Link>
        </div>
      )}
    </div>
  );
}

