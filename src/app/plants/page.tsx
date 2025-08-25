import PlantList from './PlantList';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import EmptyPlantState from '@/components/EmptyPlantState';

export default async function PlantsPage() {
  const { data: plants, error } = await supabaseAdmin
    .from('plants')
    .select('id, name, species, image_url, room:rooms(id, name)');

  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto">Failed to load plants</div>
    );
  }

  const mappedPlants =
    plants?.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      imageUrl: p.image_url as string | null,
      room: p.room as { id: string; name: string } | null,
    })) ?? [];

  if (mappedPlants.length === 0) {
    return <EmptyPlantState />;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <PlantList plants={mappedPlants} />
    </div>
  );
}

