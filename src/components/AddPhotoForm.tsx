'use client';

import { useState } from 'react';
import { CARE_EVENT_TYPES, type CareEvent, type CareEventType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { apiFetch } from '@/lib/api';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddPhotoForm({ plantId, onAdd, onReplace }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [tag, setTag] = useState<CareEventType>('water');

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
      tag,
    };
    onAdd(optimistic);
    const formData = new FormData();
    formData.append('plant_id', plantId);
    formData.append('type', 'photo');
    formData.append('photo', file);
    if (tag) formData.append('tag', tag);
    setFile(null);
    (e.target as HTMLFormElement).reset();
    try {
      const data = await apiFetch<any>('/api/events', {
        method: 'POST',
        body: formData,
      });
      const real = Array.isArray(data) ? data[0] : data;
      if (real) {
        onReplace(tempId, real);
      }
    } catch {
      // error handled by apiFetch toast
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
      <label className="text-sm">
        Tag
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value as CareEventType)}
          disabled={saving}
          className="mt-1 rounded-md border px-2 py-1"
        >
          {CARE_EVENT_TYPES.filter((t) => t !== 'photo').map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
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
