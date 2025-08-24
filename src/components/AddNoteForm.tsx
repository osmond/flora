'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddNoteForm({ plantId }: { plantId: string }) {
  const [note, setNote] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plant_id: plantId, type: 'note', note: trimmed }),
    });
    setNote('');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        className="w-full rounded border p-2 text-sm"
        placeholder="Write a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button
        type="submit"
        className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
      >
        Add Note
      </button>
    </form>
  );
}
