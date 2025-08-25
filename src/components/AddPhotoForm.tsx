'use client';

import { useState } from 'react';
import type { CareEvent } from '@/types';
import { Button } from '@/components/ui/button';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddPhotoForm({ plantId, onAdd, onReplace }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
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
      } else {
        setError('Failed to upload photo');
      }
    } catch (err) {
      console.error('Failed to upload photo', err);
      setError('Failed to upload photo');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      {error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      <Button type="submit" className="p-4">
        Upload Photo
      </Button>
    </form>
  );
}
