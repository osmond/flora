import PlantList from './PlantList';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import EmptyPlantState from '@/components/EmptyPlantState';

export default async function PlantsPage() {
  const { data: plants, error } = await supabaseAdmin
    .from('plants')
    .select('id, nickname, species_scientific, species_common, image_url, room:rooms(id, name)');

  if (error) {
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto">Failed to load plants</div>
    );
  }

  const mappedPlants =
    plants?.map((p) => ({
      id: p.id,
      nickname: p.nickname as string,
      speciesScientific: p.species_scientific as string | null,
      speciesCommon: p.species_common as string | null,
      imageUrl: p.image_url as string | null,
      room: (Array.isArray(p.room) ? p.room[0] : p.room) as
        | { id: string; name: string }
        | null,
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

