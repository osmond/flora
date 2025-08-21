"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, Textarea, Button } from "@/components/ui";

export default function AddNoteForm({ plantId }: { plantId: string }) {
  const [note, setNote] = useState("");
  const router = useRouter();
  const form = useForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plant_id: plantId, type: "note", note }),
    });

    setNote("");
    router.refresh();
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Write a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button type="submit">Add Note</Button>
      </form>
    </Form>
  );
}
