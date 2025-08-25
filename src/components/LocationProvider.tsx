'use client';

import { useEffect } from 'react';
import { getLocation } from '@/lib/location';
import { getWeather } from '@/lib/weather';

export default function LocationProvider() {
  useEffect(() => {
    async function init() {
      const loc = await getLocation();
      if (loc) {
        await getWeather(loc.lat, loc.lon);
      }
    }
    init();
  }, []);
  return null;
}
