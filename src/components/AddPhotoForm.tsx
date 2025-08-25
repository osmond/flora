'use client';

import { useState } from 'react';
import type { CareEvent } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddPhotoForm({ plantId, onAdd, onReplace }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file || saving) return;
    setSaving(true);
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
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        disabled={saving}
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button type="submit" className="p-4" disabled={saving}>
              Upload Photo
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save to gallery</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  );
}
