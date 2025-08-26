'use client';

import Image from 'next/image';
import type { CareEvent } from '@/types';

export default function PhotoGalleryClient({ events }: { events: CareEvent[] }) {
  const photos = events.filter((e) => e.type === 'photo' && e.image_url);
  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo) => (
        <Image
          key={photo.id}
          src={photo.image_url || ''}
          alt={photo.note ?? 'Photo of plant'}
          width={300}
          height={300}
          className="h-32 w-full rounded-lg object-cover"
        />
      ))}
    </div>
  );
}

