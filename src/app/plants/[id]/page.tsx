import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import QuickStats from '@/components/plant/QuickStats';
import CareTimeline from '@/components/CareTimeline';
import AddNoteForm from '@/components/AddNoteForm';
import AddPhotoForm from '@/components/AddPhotoForm';
import PhotoGallery from '@/components/PhotoGallery';
import CareCoach from '@/components/plant/CareCoach';

export default async function PlantDetailPage({ params }: { params: { id: string } }) {
  const { data: plant, error } = await supabaseAdmin
    .from('plants')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !plant) {
    return <div className="p-4">Plant not found</div>;
  }

  let heroUrl = plant.image_url as string | null;

  if (!heroUrl) {
    const { data: photos } = await supabaseAdmin
      .from('events')
      .select('image_url')
      .eq('plant_id', plant.id)
      .eq('type', 'photo')
      .order('created_at', { ascending: false });

    heroUrl = photos?.[0]?.image_url ?? null;
  }

  return (
    <div>
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={plant.name}
          width={800}
          height={400}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="h-64 w-full bg-muted" />
      )}
      <div className="p-4">
        <h1 className="text-2xl font-bold">{plant.name}</h1>
        {plant.species && (
          <p className="text-muted-foreground">{plant.species}</p>
        )}
        <QuickStats plant={plant} />
        <CareCoach plant={plant} />
      </div>
      <div className="p-4">
        <h2 className="mb-4 text-xl font-semibold">Add Note</h2>
        <AddNoteForm plantId={plant.id} />
      </div>
      <div className="p-4">
        <h2 className="mb-4 text-xl font-semibold">Photos</h2>
        <AddPhotoForm plantId={plant.id} />
        <div className="mt-4">
          <PhotoGallery plantId={plant.id} />
        </div>
      </div>
      <div className="p-4">
        <h2 className="mb-4 text-xl font-semibold">Timeline</h2>
        <CareTimeline plantId={plant.id} />
      </div>
    </div>
  );
}

