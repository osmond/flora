'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { CareEvent } from '@/types';
import { Form, FormField } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { queueEvent } from '@/lib/offlineQueue';
import { apiFetch } from '@/lib/api';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

type FormValues = {
  note: string;
};

export default function AddNoteForm({ plantId, onAdd, onReplace }: Props) {
  const [saving, setSaving] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: { note: '' },
  });

  async function onSubmit(values: FormValues) {
    if (saving) return;
    const trimmed = values.note.trim();
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
    form.reset({ note: '' });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                placeholder="Write a note..."
                className="p-4"
                disabled={saving}
                {...field}
              />
            </div>
          )}
        />
        <Button type="submit" className="p-4" disabled={saving}>
          Add Note
        </Button>
      </form>
    </Form>
  );
}
