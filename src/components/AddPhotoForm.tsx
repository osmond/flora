'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CARE_EVENT_TYPES,
  type CareEvent,
  type CareEventType,
} from '@/types';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Form, FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { apiFetch } from '@/lib/api';

interface Props {
  plantId: string;
  onAdd: (evt: CareEvent) => void;
  onReplace: (tempId: string, evt: CareEvent) => void;
}

export default function AddPhotoForm({ plantId, onAdd, onReplace }: Props) {
  const [saving, setSaving] = useState(false);

  const form = useForm<{ photo: File | null; tag: CareEventType }>({
    defaultValues: { photo: null, tag: 'water' },
  });

  async function handleSubmit(values: { photo: File | null; tag: CareEventType }) {
    const file = values.photo;
    const tag = values.tag;
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
    form.reset();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="photo">Photo</Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
              />
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="tag"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-sm">
                Tag
              </Label>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={saving}
              >
                <SelectTrigger id="tag" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARE_EVENT_TYPES.filter((t) => t !== 'photo').map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
    </Form>
  );
}
