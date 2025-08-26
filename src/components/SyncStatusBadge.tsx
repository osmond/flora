'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getQueueLength } from '@/lib/offlineQueue';

export default function SyncStatusBadge() {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const update = () => setPending(getQueueLength() > 0 || !navigator.onLine);
    update();
    window.addEventListener('flora:queue:updated', update);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('flora:queue:updated', update);
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return (
    <Badge variant={pending ? 'destructive' : 'default'}>
      {pending ? 'Pending' : 'Synced'}
    </Badge>
  );
}
