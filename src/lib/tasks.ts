import { addDays, formatISO, parseISO } from 'date-fns';
import type { Task } from '@/types/task';

interface Plant {
  id: string;
  name: string;
  waterEvery?: string | null;
  fertEvery?: string | null;
  lastWateredAt?: string | null; // ISO date string
  lastFertilizedAt?: string | null; // ISO date string
}

function parseInterval(value?: string | null): number | null {
  if (!value) return null;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function generateTasks(plants: Plant[], today: Date = new Date()): Task[] {
  const tasks: Task[] = [];

  for (const plant of plants) {
    const waterInterval = parseInterval(plant.waterEvery);
    if (waterInterval !== null && plant.lastWateredAt) {
      const due = addDays(parseISO(plant.lastWateredAt), waterInterval);
      if (due <= today) {
        tasks.push({
          id: `${plant.id}-water`,
          plantName: plant.name,
          type: 'water',
          due: formatISO(due),
        });
      }
    }

    const fertInterval = parseInterval(plant.fertEvery);
    if (fertInterval !== null && plant.lastFertilizedAt) {
      const due = addDays(parseISO(plant.lastFertilizedAt), fertInterval);
      if (due <= today) {
        tasks.push({
          id: `${plant.id}-fertilize`,
          plantName: plant.name,
          type: 'fertilize',
          due: formatISO(due),
        });
      }
    }
  }

  return tasks.sort((a, b) => a.due.localeCompare(b.due));
}
