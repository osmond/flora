"use client";

import { useEffect, useState } from "react";
import { generateWeeklyCareForecast } from "@/lib/forecast";
import type { DayForecast } from "@/types/forecast";
import type { Plant } from "@/lib/tasks";
import { apiFetch } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { addDays, format } from "date-fns";

export default function ForecastClient({ plants }: { plants: Plant[] }) {
  const [forecast, setForecast] = useState<DayForecast[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      try {
        const days = await apiFetch<any>("/api/weather");
        const data = generateWeeklyCareForecast(plants, days);
        setForecast(data);
      } catch (e) {
        setError("Could not load forecast");
        setForecast([]);
      }
    }
    load();
  }, [plants]);

  if (!forecast) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-32 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (forecast.length === 0) {
    return <p className="text-sm text-muted-foreground">No forecast available.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {forecast.map((day, idx) => {
        const d = addDays(new Date(), idx);
        const title = format(d, "EEE d MMM");
        const water = day.tasks.filter((t) => t.type === "water");
        const fert = day.tasks.filter((t) => t.type === "fertilize");
        return (
          <Card key={day.date} className="p-4">
            <div className="mb-1 text-sm font-medium">{title}</div>
            {day.weather ? (
              <div className="mb-3 text-xs text-muted-foreground">
                High {Math.round(day.weather.tempMax)}° / Low {Math.round(day.weather.tempMin)}° • Rain {Math.round(day.weather.precipitationChance)}%
              </div>
            ) : (
              <div className="mb-3 text-xs text-muted-foreground">No weather</div>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">💧 {water.length}</Badge>
              <Badge variant="secondary">🌱 {fert.length}</Badge>
            </div>
            {(water.length || fert.length) ? (
              <ul className="mt-3 space-y-1 text-xs">
                {[...water, ...fert].slice(0, 6).map((t) => (
                  <li key={t.id} className="truncate">
                    {t.plantName} — {t.type}
                  </li>
                ))}
                {[...water, ...fert].length > 6 ? (
                  <li className="text-muted-foreground">…and more</li>
                ) : null}
              </ul>
            ) : (
              <div className="mt-3 text-xs text-muted-foreground">No tasks</div>
            )}
            {error ? (
              <div className="mt-3 text-xs text-destructive">{error}</div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}

