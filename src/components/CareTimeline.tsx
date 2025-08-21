"use client";

import { useState } from "react";

type CareEvent = {
  id: string;
  type: string;
  created_at: string;
};

const typeColors: Record<string, string> = {
  water: "bg-blue-500",
  fertilize: "bg-yellow-500",
  note: "bg-gray-500",
  photo: "bg-green-500",
};

export default function CareTimeline({ events }: { events: CareEvent[] }) {
  const [filter, setFilter] = useState<string>("all");
  const types = Array.from(new Set(events.map((e) => e.type)));
  const filtered =
    filter === "all" ? events : events.filter((e) => e.type === filter);

  return (
    <div>
      <div className="mb-2 flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-sm capitalize ${
            filter === "all" ? "bg-green-600 text-white" : "bg-gray-200"
          }`}
        >
          all
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1 text-sm capitalize ${
              filter === t ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex space-x-4 overflow-x-auto py-2">
        {filtered.map((e) => (
          <div
            key={e.id}
            title={`${e.type} • ${new Date(e.created_at).toLocaleDateString()}`}
            className={`h-4 w-4 rounded-full ${
              typeColors[e.type] || "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
