"use client";

import * as React from "react";
import { queueEvent, type EventPayload } from "@/lib/offlineQueue";
import { Button } from "@/components/ui/button";

type Props = { plantId: string };

export function EventQuickAdd({ plantId }: Props) {
  const [note, setNote] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  async function add(type: "water" | "fertilize" | "note") {
    if (loading) return; // prevent duplicate submissions

    const payload: EventPayload = { plant_id: plantId, type } as EventPayload;
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
      } else if (!navigator.onLine) {
        queueEvent(payload);
      }
    } catch {
      queueEvent(payload);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="log-event" className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={() => add("water")}
          disabled={loading}
          size="sm"
        >
          Watered
        </Button>
        <Button
          type="button"
          onClick={() => add("fertilize")}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Fertilized
        </Button>
      </div>
      <div className="flex gap-2">
        <input
          className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Quick note…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          type="button"
          onClick={() => add("note")}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          Add note
        </Button>
      </div>
    </div>
  );
}
