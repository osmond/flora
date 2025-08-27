'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  plantId: string;
  waterEvery?: string | null;
  fertEvery?: string | null;
}

export default function ScheduleAdjuster({ plantId, waterEvery, fertEvery }: Props) {
  const [water, setWater] = useState(waterEvery ?? '');
  const [fert, setFert] = useState(fertEvery ?? '');
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
        body: JSON.stringify({ waterEvery: water || null, fertEvery: fert || null }),
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="waterEvery">Water every</Label>
          <Input id="waterEvery" value={water} onChange={(e) => setWater(e.target.value)} placeholder="e.g. 7 days" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="fertEvery">Fertilize every</Label>
          <Input id="fertEvery" value={fert} onChange={(e) => setFert(e.target.value)} placeholder="e.g. 30 days" />
        </div>
      </div>
      <div className="flex justify-end">
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
