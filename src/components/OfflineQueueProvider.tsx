'use client';

import { useEffect } from 'react';
import { startQueue } from '@/lib/offlineQueue';

export default function OfflineQueueProvider() {
  useEffect(() => {
    startQueue();
  }, []);
  return null;
}
