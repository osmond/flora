'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PlantCard } from '@/components';

interface Plant {
  id: string;
  name: string;
  species?: string | null;
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
        <button
          aria-label="Grid view"
          onClick={() => setView('grid')}
          className={`rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary ${view === 'grid' ? 'bg-muted' : ''}`}
        >
          Grid
        </button>
        <button
          aria-label="List view"
          onClick={() => setView('list')}
          className={`rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary ${view === 'list' ? 'bg-muted' : ''}`}
        >
          List
        </button>
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
                      <img
                        src={plant.imageUrl}
                        alt={plant.name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-xl bg-muted" />
                    )}
                    <div>
                      <p className="font-medium">{plant.name}</p>
                      {plant.species && (
                        <p className="text-sm text-muted-foreground">
                          {plant.species}
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

