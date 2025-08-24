import Image from 'next/image';
import db from '@/lib/db';
import QuickStats from '@/components/plant/QuickStats';
import PhotoGallery from '@/components/PhotoGallery';
import CareCoach from '@/components/plant/CareCoach';
import EventsSection from '@/components/EventsSection';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { hydrateTimeline } from '@/lib/tasks';

export default async function PlantDetailPage({ params }: { params: { id: string } }) {
  const plant = await db.plant.findUnique({ where: { id: params.id } });
  if (!plant) {
    return (
      <div className="p-4 md:p-6 max-w-md mx-auto">Plant not found</div>
    );
  }

  let heroUrl = plant.imageUrl;
  if (!heroUrl) {
    const photo = await db.photo.findFirst({
      where: { plantId: plant.id },
      orderBy: { createdAt: 'desc' },
      select: { url: true },
    });
    heroUrl = photo?.url ?? null;
  }

  const { data: events } = await supabaseAdmin
    .from('events')
    .select('id, type, note, image_url, created_at')
    .eq('plant_id', plant.id)
    .order('created_at', { ascending: false });

  const timelineEvents = hydrateTimeline(events ?? [], {
    id: plant.id,
    waterEvery: plant.waterEvery,
    fertEvery: plant.fertEvery,
  });

  return (
    <div>
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={plant.name}
          width={800}
          height={400}
          className="h-64 w-full object-cover md:h-80"
        />
      ) : (
        <div className="h-64 w-full bg-muted md:h-80" />
      )}
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">{plant.name}</h1>
        {plant.species && (
          <p className="text-muted-foreground">{plant.species}</p>
        )}
        <QuickStats plant={plant} />
        <CareCoach plant={plant} />
      </div>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <EventsSection plantId={plant.id} initialEvents={timelineEvents} />
      </div>
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <h2 className="mb-4 text-xl font-semibold">Photos</h2>
        <PhotoGallery plantId={plant.id} />
      </div>
    </div>
  );
}

