'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { getLocation } from '@/lib/location';
import { getWeather } from '@/lib/weather';

export default function LocationProvider() {
  useEffect(() => {
    async function init() {
      try {
        const loc = await getLocation();
        if (loc) {
          await getWeather(loc.lat, loc.lon);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to access location';
        toast.error(message);
      }
    }
    init();
  }, []);
  return null;
}
