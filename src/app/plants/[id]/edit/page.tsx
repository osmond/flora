import EditPlantForm from "@/components/plant/EditPlantForm";
import db from "@/lib/db";

export default async function EditPlantPage({
  params,
}: {
  params: { id: string };
}) {
  const plant = await db.plant.findFirst({
    where: { id: params.id, archived: false },
    select: { id: true, name: true, species: true, imageUrl: true },
  });
  if (!plant) {
    return <div className="p-4 md:p-6 max-w-md mx-auto">Plant not found</div>;
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Edit Plant</h1>
        <EditPlantForm plant={plant} />
      </div>
    </main>
  );
}

