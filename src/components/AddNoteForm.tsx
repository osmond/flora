'use client';

import { useState } from 'react';
import type { CareEvent } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { queueEvent } from '@/lib/offlineQueue';
import { apiFetch } from '@/lib/api';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddNoteForm({ plantId, onAdd, onReplace }: Props) {
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    const trimmed = note.trim();
    if (!trimmed) return;
    setSaving(true);
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
    const payload = { plant_id: plantId, type: 'note', note: trimmed };
    try {
      const data = await apiFetch<any>('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const real = Array.isArray(data) ? data[0] : data;
      if (real) {
        onReplace(tempId, real);
      }
    } catch {
      if (!navigator.onLine) {
        queueEvent(payload);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="note">Note</Label>
        <textarea
          id="note"
          className="w-full rounded-md border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Write a note..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <Button type="submit" className="p-4" disabled={saving}>
        Add Note
      </Button>
    </form>
  );
}
