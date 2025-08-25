'use client';

import { useEffect, useState } from 'react';
import { generateWeeklyCareForecast } from '@/lib/forecast';
import type { DayForecast } from '@/types/forecast';

const samplePlants = [
  {
    id: '1',
    name: 'Monstera',
    waterEvery: '7 days',
    lastWateredAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    fertEvery: '30 days',
    lastFertilizedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
];

export default function ForecastPage() {
  const [forecast, setForecast] = useState<DayForecast[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/weather');
      const weather = await res.json();
      const data = generateWeeklyCareForecast(samplePlants, weather);
      setForecast(data);
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

