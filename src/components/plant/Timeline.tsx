"use client";

import * as React from "react";

type Event = {
  id: number;
  type: string;
  note: string | null;
  created_at: string;
};

export function Timeline({ plantId }: { plantId: number }) {
  const [items, setItems] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events?plantId=${plantId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load events");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("flora:events:changed", handler as any);
    return () => window.removeEventListener("flora:events:changed", handler as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantId]);

  if (loading) return <p className="text-sm text-muted-foreground">Loading timeline…</p>;
  if (error)
    return (
      <div className="flex items-center gap-2 text-sm text-destructive">
        <span>{error}</span>
        <button
          type="button"
          onClick={load}
          className="rounded-md border px-2 py-1 text-xs"
        >
          Retry
        </button>
      </div>
    );
  if (items.length === 0) return <p className="text-sm text-muted-foreground">No events yet.</p>;

  return (
    <ul className="space-y-4">
      {items.map((ev) => (
        <li key={ev.id} className="flex items-start gap-3">
          <span>{iconFor(ev.type)}</span>
          <div>
            <p className="text-sm font-medium capitalize">{ev.type}</p>
            {ev.note ? <p className="text-sm">{ev.note}</p> : null}
            <p className="text-xs text-muted-foreground">{new Date(ev.created_at).toLocaleString()}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function iconFor(type: string) {
  switch (type) {
    case "watered": return "💧";
    case "fertilized": return "🧪";
    case "misted": return "🌫️";
    case "rotated": return "🔁";
    case "repotted": return "🪴";
    case "pruned": return "✂️";
    case "photo": return "🖼️";
    case "note": return "📝";
    default: return "•";
  }
}
