"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid2X2, List, PlusCircle } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { PlantCard } from "@/components/plant-card";

type Plant = { id: string; name: string; species: string; room?: string; photoUrl?: string; nextIn?: string; };

const DEMO: Plant[] = [
  { id: "1", name: "Kay", species: "Monstera deliciosa", room: "Kitchen", nextIn: "2d" },
  { id: "2", name: "Moss", species: "Pothos", room: "Office", nextIn: "5d" },
  { id: "3", name: "Rue", species: "ZZ Plant", room: "Hall", nextIn: "1d" },
];

export default function PlantsPage() {
  const [view, setView] = React.useState<"grid"|"list">("grid");
  const [room, setRoom] = React.useState<string>("all");
  const [q, setQ] = React.useState("");

  const plants = DEMO.filter(p => (room==="all"||p.room===room) && (`${p.name} ${p.species}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 space-y-6">
      <header className="flex items-center gap-3">
        <SectionTitle>Your Plants</SectionTitle>
        <div className="ml-auto flex items-center gap-2">
            <Input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="h-10 w-48 rounded-lg" />
            <Select value={room} onValueChange={setRoom}>
              <SelectTrigger className="h-10 rounded-lg w-40"><SelectValue placeholder="Room" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All rooms</SelectItem><SelectItem value="Kitchen">Kitchen</SelectItem><SelectItem value="Office">Office</SelectItem><SelectItem value="Hall">Hall</SelectItem></SelectContent>
            </Select>
            <ToggleGroup type="single" value={view} onValueChange={(v: "grid" | "list" | null)=>v && setView(v)}>
              <ToggleGroupItem value="grid" aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view"><List className="h-4 w-4" /></ToggleGroupItem>
            </ToggleGroup>
          <Button asChild className="rounded-xl"><Link href="/add"><PlusCircle className="h-4 w-4 mr-1" />Add Plant</Link></Button>
        </div>
      </header>

        {plants.length === 0 ? (
        <div className="rounded-xl border p-8 text-center bg-muted/30">
          <div className="text-3xl mb-2">🌿</div>
          <h3 className="font-semibold mb-1">No plants yet</h3>
          <p className="text-muted-foreground mb-4">Add your first plant to get personalized care.</p>
          <Button asChild><Link href="/add">Add a Plant</Link></Button>
        </div>
      ) : view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map(p => (
            <Link key={p.id} href={`/plants/${p.id}`} className="block focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
              <PlantCard name={p.name} species={p.species} room={p.room!} next={p.nextIn!} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {plants.map(p => (
            <Link key={p.id} href={`/plants/${p.id}`} className="block focus-visible:ring-2 focus-visible:ring-ring rounded-2xl">
              <PlantCard name={p.name} species={p.species} room={p.room!} next={p.nextIn!} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
