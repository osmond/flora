'use client';

import { useEffect, useState } from 'react';
import { generateWeeklyCareForecast } from '@/lib/forecast';
import type { DayForecast } from '@/types/forecast';
import type { Plant } from '@/lib/tasks';
import { apiFetch } from '@/lib/api';

const samplePlants: Plant[] = [
  {
    id: '1',
    nickname: 'Monstera',
    waterEvery: '7 days',
    lastWateredAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: '2',
    nickname: 'Fiddle Leaf Fig',
    fertEvery: '30 days',
    lastFertilizedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

export default function ForecastPage() {
  const [forecast, setForecast] = useState<DayForecast[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const weather = await apiFetch<any>('/api/weather');
        const data = generateWeeklyCareForecast(samplePlants, weather);
        setForecast(data);
      } catch {
        // errors handled by apiFetch
      }
    }
    load();
  }, []);

  return (
    <section className="p-4">
      <h1 className="mb-4 text-xl font-semibold">Weekly Care Forecast</h1>
      <ul>
        {forecast.map((day) => (
          <li key={day.date} className="mb-4">
            <div className="font-medium">{day.date}</div>
            {day.weather && (
              <div className="text-sm text-muted-foreground">
                High {day.weather.tempMax}°C / Low {day.weather.tempMin}°C – Rain {day.weather.precipitationChance}%
              </div>
            )}
            {day.tasks.length > 0 ? (
              <ul className="ml-5 list-disc">
                {day.tasks.map((t) => (
                  <li key={t.id} className="text-sm">
                    {t.plantName} – {t.type}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm">No tasks</div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

