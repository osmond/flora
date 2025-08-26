'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlantCard } from '@/components';
import { Button } from '@/components/ui/button';

interface Plant {
  id: string;
  nickname: string;
  speciesScientific?: string | null;
  speciesCommon?: string | null;
  imageUrl?: string | null;
  room?: { id: string; name: string } | null;
}

export default function PlantList({ plants }: { plants: Plant[] }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const grouped = useMemo(() => {
    return plants.reduce<Record<string, Plant[]>>((acc, plant) => {
      const roomName = plant.room?.name ?? 'Unassigned';
      if (!acc[roomName]) acc[roomName] = [];
      acc[roomName].push(plant);
      return acc;
    }, {});
  }, [plants]);

  return (
    <div>
      <div className="mb-4 flex justify-end gap-3">
        <Button
          aria-label="Grid view"
          onClick={() => setView('grid')}
          variant={view === 'grid' ? 'secondary' : 'outline'}
          size="sm"
        >
          Grid
        </Button>
        <Button
          aria-label="List view"
          onClick={() => setView('list')}
          variant={view === 'list' ? 'secondary' : 'outline'}
          size="sm"
        >
          List
        </Button>
      </div>
      {Object.entries(grouped).map(([roomName, roomPlants]) => (
        <section key={roomName} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{roomName}</h2>
            {view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {roomPlants.map((plant) => (
                <PlantCard key={plant.id} plant={plant} />
              ))}
            </div>
          ) : (
            <ul className="divide-y rounded border">
              {roomPlants.map((plant) => (
                <li key={plant.id}>
                  <Link
                    href={`/plants/${plant.id}`}
                    className="flex items-center gap-4 p-2"
                  >
                    {plant.imageUrl ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden">
                        <Image
                          src={plant.imageUrl}
                          alt={`Photo of ${plant.nickname}`}
                          fill
                          className="h-12 w-12 rounded-lg object-cover"
                          sizes="(min-width: 768px) 768px, 100vw"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted" />
                    )}
                    <div>
                      <p className="font-medium">{plant.nickname}</p>
                      {(plant.speciesScientific || plant.speciesCommon) && (
                        <p className="text-sm text-muted-foreground">
                          {plant.speciesScientific || plant.speciesCommon}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

