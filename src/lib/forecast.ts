import { addDays, formatISO, parseISO } from 'date-fns';
import type { Plant } from './tasks';
import { parseInterval } from './tasks';
import type { WeatherDay, DayForecast } from '@/types/forecast';
import type { Task } from '@/types/task';

export function generateWeeklyCareForecast(
  plants: Plant[],
  weather: WeatherDay[],
  start: Date = new Date()
): DayForecast[] {
  const days: DayForecast[] = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const dateStr = formatISO(date, { representation: 'date' });
    const tasks: Task[] = [];

    for (const plant of plants) {
      const waterInterval = parseInterval(plant.waterEvery);
      if (waterInterval !== null && plant.lastWateredAt) {
        const nextWater = addDays(parseISO(plant.lastWateredAt), waterInterval);
        const nextWaterStr = formatISO(nextWater, { representation: 'date' });
        if (nextWaterStr === dateStr) {
          tasks.push({
            id: `${plant.id}-water-${dateStr}`,
            plantId: plant.id,
            plantName: plant.name,
            type: 'water',
            due: nextWaterStr,
          });
        }
      }

      const fertInterval = parseInterval(plant.fertEvery);
      if (fertInterval !== null && plant.lastFertilizedAt) {
        const nextFert = addDays(parseISO(plant.lastFertilizedAt), fertInterval);
        const nextFertStr = formatISO(nextFert, { representation: 'date' });
        if (nextFertStr === dateStr) {
          tasks.push({
            id: `${plant.id}-fertilize-${dateStr}`,
            plantId: plant.id,
            plantName: plant.name,
            type: 'fertilize',
            due: nextFertStr,
          });
        }
      }
    }

    const dayWeather = weather.find((w) => w.date === dateStr);
    days.push({ date: dateStr, tasks, weather: dayWeather });
  }

  return days;
}

