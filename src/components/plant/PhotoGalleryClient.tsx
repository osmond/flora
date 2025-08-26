'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
          <Button
            key={photo.id}
            type="button"
            variant="ghost"
            className="h-auto w-full flex-shrink-0 snap-center p-0"
            onClick={() => setActive(photo)}
            aria-label="View photo"
          >
            <div className="relative">
              <Image
                src={photo.image_url || ''}
                alt={photo.note ?? 'Photo of plant'}
                width={300}
                height={300}
                className="h-48 w-full rounded-lg object-cover"
              />
              {photo.tag && (
                <span className="absolute left-2 top-2 rounded bg-background/80 px-2 text-xs capitalize">
                  {photo.tag}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <Button
            type="button"
            aria-label="Previous"
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2"
            onClick={() => scrollByDir(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            aria-label="Next"
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => scrollByDir(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="h-full w-full max-w-full flex items-center justify-center p-4 bg-transparent border-0 shadow-none">
          <DialogTitle className="sr-only">Full size photo</DialogTitle>
          <DialogDescription className="sr-only">
            Enlarged view of the selected plant photo
          </DialogDescription>
          {active && (
            <Image
              src={active.image_url || ''}
              alt={active.note ?? 'Photo of plant'}
              width={1000}
              height={1000}
              className="max-h-full w-auto object-contain"
            />
          )}
          <DialogClose className="absolute right-4 top-4 text-white">
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

