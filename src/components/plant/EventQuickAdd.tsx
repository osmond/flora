"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Form, FormField } from "@/components/ui";
import { queueEvent, type EventPayload } from "@/lib/offlineQueue";

type Props = { plantId: string };

export function EventQuickAdd({ plantId }: Props) {
  const [loading, setLoading] = React.useState(false);
  const form = useForm<{ note: string }>({
    defaultValues: { note: "" },
  });

  async function add(type: "water" | "fertilize" | "note") {
    if (loading) return; // prevent duplicate submissions

    const note = form.getValues("note");
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
        form.reset({ note: "" });
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
    <Form {...form}>
      <div id="log-event" className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => add("water")}
            disabled={loading}
            variant="default"
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
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Quick note…"
                className="h-9 flex-1"
              />
            )}
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
    </Form>
  );
}
