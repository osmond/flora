import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

interface PhotoEvent {
  id: string;
  image_url: string | null;
}

export default async function PhotoGallery({ plantId }: { plantId: string }) {
  const { data: photos, error } = await supabaseAdmin
    .from('events')
    .select('id, image_url')
    .eq('plant_id', plantId)
    .eq('type', 'photo')
    .order('created_at', { ascending: false });

  if (error || !photos || photos.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {photos.map((photo: PhotoEvent) => (
        <Image
          key={photo.id}
          src={photo.image_url ?? ''}
          alt="Plant photo"
          width={300}
          height={300}
          className="h-32 w-full rounded object-cover"
        />
      ))}
    </div>
  );
}
