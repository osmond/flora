"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  ToggleGroup,
  ToggleGroupItem,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui";
import { List, Grid } from "lucide-react";

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
  const [roomFilter, setRoomFilter] = useState("all");

  const rooms = Array.from(new Set(plants.map((p) => p.room || "Unassigned"))).sort();

  const filtered =
    roomFilter === "all"
      ? plants
      : plants.filter((p) => (p.room || "Unassigned") === roomFilter);

  const grouped = filtered.reduce((acc: Record<string, Plant[]>, plant) => {
    const room = plant.room || "Unassigned";
    acc[room] = acc[room] || [];
    acc[room].push(plant);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={roomFilter} onValueChange={setRoomFilter}>
          <SelectTrigger className="w-[180px]" aria-label="Filter by room">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All rooms</SelectItem>
            {rooms.map((room) => (
              <SelectItem key={room} value={room}>
                {room}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(val) => val && setView(val as "list" | "grid")}
          className="sm:ml-auto"
        >
          <ToggleGroupItem value="list" aria-label="List view" variant="outline">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" aria-label="Grid view" variant="outline">
            <Grid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {Object.entries(grouped).map(([room, plants]) => (
        <section key={room} className="mb-8">
          <h2 className="mb-2 text-xl font-semibold">{room}</h2>
          {view === "list" ? (
            <ul className="space-y-4">
              {plants.map((plant) => (
                <li key={plant.id}>
                  <Link href={`/plants/${plant.id}`} className="block">
                    <Card className="bg-white rounded-2xl shadow-card">
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
                    <Card className="overflow-hidden bg-white rounded-2xl shadow-card">
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
                      <CardContent className="p-4 text-center text-sm font-medium">
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
