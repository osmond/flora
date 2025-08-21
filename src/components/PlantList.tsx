"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Toggle,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";

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
        <Toggle
          pressed={view === "grid"}
          onPressedChange={(pressed) => setView(pressed ? "grid" : "list")}
          variant="outline"
        >
          {view === "list" ? "Grid view" : "List view"}
        </Toggle>
      </div>
      {Object.entries(grouped).map(([room, plants]) => (
        <section key={room} className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">{room}</h2>
          {view === "list" ? (
            <ul className="space-y-4">
              {plants.map((plant) => (
                <li key={plant.id}>
                  <Link href={`/plants/${plant.id}`} className="block">
                    <Card>
                      <CardHeader>
                        <CardTitle>{plant.name}</CardTitle>
                        {plant.common_name && (
                          <CardDescription>{plant.common_name}</CardDescription>
                        )}
                        {plant.species && (
                          <CardDescription className="italic">
                            {plant.species}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {plants.map((plant) => (
                <li key={plant.id}>
                  <Link href={`/plants/${plant.id}`} className="block">
                    <Card className="overflow-hidden">
                      {plant.image_url ? (
                        <img
                          src={plant.image_url}
                          alt={plant.name}
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-32 items-center justify-center bg-muted text-muted-foreground">
                          {plant.name}
                        </div>
                      )}
                      <CardContent className="p-2 text-center text-sm font-medium">
                        {plant.name}
                      </CardContent>
                    </Card>
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
