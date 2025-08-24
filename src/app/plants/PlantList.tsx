'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlantCard } from '@/components';

interface Plant {
  id: string;
  name: string;
  species?: string | null;
  imageUrl?: string | null;
}

export default function PlantList({ plants }: { plants: Plant[] }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div>
      <div className="mb-4 flex justify-end gap-2">
        <button
          aria-label="Grid view"
          onClick={() => setView('grid')}
          className={`rounded px-2 py-1 ${view === 'grid' ? 'bg-muted' : ''}`}
        >
          Grid
        </button>
        <button
          aria-label="List view"
          onClick={() => setView('list')}
          className={`rounded px-2 py-1 ${view === 'list' ? 'bg-muted' : ''}`}
        >
          List
        </button>
      </div>
      {view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <ul className="divide-y rounded border">
          {plants.map((plant) => (
            <li key={plant.id}>
              <Link
                href={`/plants/${plant.id}`}
                className="flex items-center gap-4 p-2"
              >
                {plant.imageUrl ? (
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-muted" />
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
    </div>
  );
}

