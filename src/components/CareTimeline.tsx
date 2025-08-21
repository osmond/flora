"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

type CareEvent = {
  id: string;
  type: string;
  created_at: string;
};

const typeColors: Record<string, string> = {
  water: "bg-primary",
  fertilize: "bg-accent",
  note: "bg-muted-foreground",
  photo: "bg-primary",
};

export default function CareTimeline({ events }: { events: CareEvent[] }) {
  const [filter, setFilter] = useState<string>("all");
  const types = Array.from(new Set(events.map((e) => e.type)));
  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <div>
      <div className="mb-2 flex space-x-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "secondary"}
          onClick={() => setFilter("all")}
          className="rounded-full capitalize"
        >
          all
        </Button>
        {types.map((t) => (
          <Button
            key={t}
            size="sm"
            variant={filter === t ? "default" : "secondary"}
            onClick={() => setFilter(t)}
            className="rounded-full capitalize"
          >
            {t}
          </Button>
        ))}
      </div>
      <div className="flex space-x-4 overflow-x-auto py-2">
        {filtered.map((e) => (
          <div
            key={e.id}
            title={`${e.type} • ${new Date(e.created_at).toLocaleDateString()}`}
            className={`h-4 w-4 rounded-full ${
              typeColors[e.type] || "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
