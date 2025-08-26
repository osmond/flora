'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { CareEvent } from '@/types';

export default function PhotoGalleryClient({ events }: { events: CareEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<{
    id: string;
    image_url: string | null;
    note: string | null;
  } | null>(null);
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
          <button
            key={photo.id}
            type="button"
            className="w-full flex-shrink-0 snap-center focus:outline-none"
            onClick={() => setActive(photo)}
            aria-label="View photo"
          >
            <Image
              src={photo.image_url || ''}
              alt={photo.note ?? 'Photo of plant'}
              width={300}
              height={300}
              className="h-48 w-full rounded-lg object-cover"
            />
          </button>
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

      <Dialog.Root open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80" />
          <Dialog.Content
            className="fixed inset-0 flex items-center justify-center p-4"
          >
            <Dialog.Title className="sr-only">Full size photo</Dialog.Title>
            <Dialog.Description className="sr-only">
              Enlarged view of the selected plant photo
            </Dialog.Description>
            {active && (
              <Image
                src={active.image_url || ''}
                alt={active.note ?? 'Photo of plant'}
                width={1000}
                height={1000}
                className="max-h-full w-auto object-contain"
              />
            )}
            <Dialog.Close className="absolute right-4 top-4 text-white">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

