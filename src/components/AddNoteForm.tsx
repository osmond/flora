'use client';

import { useState } from 'react';
import type { CareEvent } from '@/types';
import { Button } from '@/components/ui/button';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddNoteForm({ plantId, onAdd, onReplace }: Props) {
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic: CareEvent = {
      id: tempId,
      type: 'note',
      note: trimmed,
      image_url: null,
      created_at: new Date().toISOString(),
    };
    onAdd(optimistic);
    setNote('');
    setError(null);
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: plantId, type: 'note', note: trimmed }),
      });
      if (res.ok) {
        const data = await res.json();
        const real = Array.isArray(data) ? data[0] : data;
        if (real) {
          onReplace(tempId, real);
        }
      } else {
        setError('Failed to add note');
      }
    } catch (err) {
      console.error('Failed to add note', err);
      setError('Failed to add note');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        className="w-full rounded-xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Write a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      <Button type="submit" className="p-4">
        Add Note
      </Button>
    </form>
  );
}
