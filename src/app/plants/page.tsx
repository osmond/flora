import Link from 'next/link';
import PlantList from './PlantList';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function PlantsPage() {
  const { data: plants, error } = await supabaseAdmin
    .from('plants')
    .select('*');

  if (error) {
    return <div className="p-4">Failed to load plants</div>;
  }

  if (!plants || plants.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">You haven&apos;t added any plants yet.</p>
        <Link href="/plants/new" className="text-primary underline">
          Add your first plant
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <PlantList plants={plants} />
    </div>
  );
}

