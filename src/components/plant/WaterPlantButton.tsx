'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  plantId: string;
}

export default function WaterPlantButton({ plantId }: Props) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (saving) return;
    setSaving(true);
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plant_id: plantId, type: 'water' }),
      });
      router.refresh();
    } catch (err) {
      console.error('Failed to mark as watered', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button onClick={handleClick} disabled={saving} className="mt-4 w-full">
      Mark as watered
    </Button>
  );
}

