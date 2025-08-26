'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CareEvent } from '@/types';

export default function PhotoGalleryClient({ events }: { events: CareEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const photos = events.filter((e) => e.type === 'photo' && e.image_url);
  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet.</p>;
  }

  function scrollByDir(dir: number) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({
      left: dir * container.clientWidth,
      behavior: 'smooth',
    });
  }

  return (
    <div className="relative" aria-label="Photo gallery">
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth touch-pan-x"
      >
        {photos.map((photo) => (
          <div key={photo.id} className="w-full flex-shrink-0 snap-center">
            <Image
              src={photo.image_url || ''}
              alt={photo.note ?? 'Photo of plant'}
              width={300}
              height={300}
              className="h-48 w-full rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1 shadow"
            onClick={() => scrollByDir(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/70 p-1 shadow"
            onClick={() => scrollByDir(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

