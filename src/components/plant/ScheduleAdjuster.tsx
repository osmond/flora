'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  plantId: string;
  waterEvery?: string | null;
}

export default function ScheduleAdjuster({ plantId, waterEvery }: Props) {
  const [value, setValue] = useState(waterEvery ?? '');
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch(`/api/ai-care?plantId=${plantId}`);
        const json = await res.json();
        if (Array.isArray(json.suggestions)) {
          setSuggestions(json.suggestions as string[]);
        }
      } catch {
        // ignore
      }
    }
    fetchSuggestions();
  }, [plantId]);

  async function onSave() {
    setSaving(true);
    try {
      await fetch(`/api/plants/${plantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waterEvery: value || null }),
      });
      router.refresh();
    } catch (err) {
      console.error('Failed to update schedule', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="waterEvery">Water every</Label>
          <Input id="waterEvery" value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 7 days" />
        </div>
        <Button disabled={saving} onClick={onSave}>Save</Button>
      </div>
      {suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground list-disc pl-5 space-y-1">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
