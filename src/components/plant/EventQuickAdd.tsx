"use client";

import * as React from "react";

type Props = { plantId: number };

export function EventQuickAdd({ plantId }: Props) {
  const [note, setNote] = React.useState("");

  async function add(type: "watered" | "fertilized" | "note") {
    const payload: Record<string, unknown> = { plantId, type };
    if (type === "note" && note.trim()) payload.note = note.trim();

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setNote("");
      // Consumers should refetch timeline; emit custom event
      window.dispatchEvent(new CustomEvent("flora:events:changed", { detail: { plantId } }));
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => add("watered")} className="h-9 rounded-md bg-primary px-3 text-sm text-primary-foreground">Watered</button>
        <button type="button" onClick={() => add("fertilized")} className="h-9 rounded-md border px-3 text-sm">Fertilized</button>
      </div>
      <div className="flex gap-2">
        <input
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Quick note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button type="button" onClick={() => add("note")} className="h-9 rounded-md border px-3 text-sm">Add note</button>
      </div>
    </div>
  );
}
