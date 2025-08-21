import Link from "next/link";
import PlantList from "@/components/PlantList";
import { getPlants } from "@/lib/data";
import { Button } from "@/components/ui";

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
        <div className="rounded-xl border p-8 bg-muted/30 text-center shadow-sm">
          <div className="mb-2 text-3xl">🌿</div>
          <h3 className="mb-1 font-semibold">No plants yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first plant to get personalized care.
          </p>
          <Button asChild>
            <Link href="/add">Add your first plant</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

