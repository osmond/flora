"use client";

import * as React from "react";

type Props = { plantId: string };

export function EventQuickAdd({ plantId }: Props) {
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function add(type: "water" | "fertilize" | "note") {
    if (loading) return; // prevent duplicate submissions

    const payload: Record<string, unknown> = { plant_id: plantId, type };
    if (type === "note" && note.trim()) payload.note = note.trim();

    try {
      setLoading(true);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setNote("");
        // Consumers should refetch timeline; emit custom event
        window.dispatchEvent(
          new CustomEvent("flora:events:changed", { detail: { plantId } }),
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => add("water")}
          disabled={loading}
          className="h-9 rounded-md bg-primary px-3 text-sm text-primary-foreground disabled:opacity-50"
        >
          Watered
        </button>
        <button
          type="button"
          onClick={() => add("fertilize")}
          disabled={loading}
          className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
        >
          Fertilized
        </button>
      </div>
      <div className="flex gap-2">
        <input
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Quick note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          onClick={() => add("note")}
          disabled={loading}
          className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
        >
          Add note
        </button>
      </div>
    </div>
  );
}
