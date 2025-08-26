'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { queueEvent } from '@/lib/offlineQueue';
import { apiFetch } from '@/lib/api';

interface Props {
  plantId: string;
}

export default function WaterPlantButton({ plantId }: Props) {
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (saving) return;
    setSaving(true);
    const payload = { plant_id: plantId, type: 'water' };
    try {
      await apiFetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      router.refresh();
    } catch {
      if (!navigator.onLine) {
        queueEvent(payload);
      }
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

