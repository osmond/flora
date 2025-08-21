"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddNoteForm({ plantId }: { plantId: string }) {
  const [note, setNote] = useState("");
  const router = useRouter();

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
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full rounded border p-2"
        placeholder="Write a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit" className="rounded bg-green-600 px-3 py-1 text-white">
        Add Note
      </button>
    </form>
  );
}
