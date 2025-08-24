'use client';

import { useState } from 'react';
import type { CareEvent } from '@/types';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddPhotoForm({ plantId, onAdd, onReplace }: Props) {
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    const tempId = `temp-${Date.now()}`;
    const optimistic: CareEvent = {
      id: tempId,
      type: 'photo',
      note: null,
      image_url: null,
      created_at: new Date().toISOString(),
    };
    onAdd(optimistic);
    const formData = new FormData();
    formData.append('plant_id', plantId);
    formData.append('type', 'photo');
    formData.append('photo', file);
    setFile(null);
    (e.target as HTMLFormElement).reset();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const real = Array.isArray(data) ? data[0] : data;
        if (real) {
          onReplace(tempId, real);
        }
      }
    } catch (err) {
      console.error('Failed to upload photo', err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="submit"
        className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
      >
        Upload Photo
      </button>
    </form>
  );
}
