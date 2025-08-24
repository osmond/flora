import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function PlantDetailPage({ params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin
    .from('plants')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return <div className="p-4">Plant not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p className="text-muted-foreground">{data.species}</p>
    </div>
  );
}

