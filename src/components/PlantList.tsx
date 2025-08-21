"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type Plant = {
  id: string;
  name: string;
  room: string | null;
  species: string | null;
  common_name: string | null;
  image_url: string | null;
};

export default function PlantList({ plants }: { plants: Plant[] }) {
  const [view, setView] = useState<"list" | "grid">("list");

  const grouped = plants.reduce((acc: Record<string, Plant[]>, plant) => {
    const room = plant.room || "Unassigned";
    acc[room] = acc[room] || [];
    acc[room].push(plant);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setView(view === "list" ? "grid" : "list")}
          className="rounded border px-3 py-1 text-sm"
        >
          {view === "list" ? "Grid view" : "List view"}
        </Button>
      </div>
      {Object.entries(grouped).map(([room, plants]) => (
        <section key={room} className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">{room}</h2>
          {view === "list" ? (
            <ul className="space-y-4">
              {plants.map((plant) => (
                <li key={plant.id}>
                  <Link
                    href={`/plants/${plant.id}`}
                    className="block rounded border p-4"
                  >
                    <div className="font-semibold">{plant.name}</div>
                    {plant.common_name && (
                      <div className="text-sm text-gray-600">
                        {plant.common_name}
                      </div>
                    )}
                    {plant.species && (
                      <div className="text-sm italic text-gray-600">
                        {plant.species}
                      </div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {plants.map((plant) => (
                <li key={plant.id}>
                  <Link
                    href={`/plants/${plant.id}`}
                    className="block overflow-hidden rounded border"
                  >
                    {plant.image_url ? (
                      <img
                        src={plant.image_url}
                        alt={plant.name}
                        className="h-32 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center bg-gray-100 text-gray-500">
                        {plant.name}
                      </div>
                    )}
                    <div className="p-2 text-center text-sm font-medium">
                      {plant.name}
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
