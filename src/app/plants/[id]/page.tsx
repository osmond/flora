export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Plant {id}</h1>
    </div>
  );
}
