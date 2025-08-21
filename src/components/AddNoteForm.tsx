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
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        placeholder="Write a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        Add Note
      </button>
    </form>
  );
}
