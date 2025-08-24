import { addDays, formatISO, parseISO } from 'date-fns';
import type { Task } from '@/types/task';
import type { CareEvent } from '@/types';

export interface Plant {
  id: string;
  name: string;
  waterEvery?: string | null;
  fertEvery?: string | null;
  lastWateredAt?: string | null; // ISO date string
  lastFertilizedAt?: string | null; // ISO date string
}

function parseInterval(value?: string | null): number | null {
  if (!value) return null;

  const match = value
    .toLowerCase()
    .match(/(\d+)\s*(day|week|month|year)s?/);
  if (!match) return null;

  const quantity = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 'day':
      return quantity;
    case 'week':
      return quantity * 7;
    case 'month':
      return quantity * 30;
    case 'year':
      return quantity * 365;
    default:
      return null;
  }
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

export function hydrateTimeline(
  events: CareEvent[],
  plant: Pick<Plant, 'id' | 'waterEvery' | 'fertEvery'>
): CareEvent[] {
  const upcoming: CareEvent[] = [];

  const lastWater = events.find((e) => e.type === 'water');
  const lastFert = events.find((e) => e.type === 'fertilize');

  function addUpcoming(
    lastDate: string | undefined,
    interval?: string | null,
    type?: 'water' | 'fertilize'
  ) {
    const days = parseInterval(interval);
    if (!lastDate || days === null || !type) return;
    const due = addDays(parseISO(lastDate), days);
    upcoming.push({
      id: `${plant.id}-${type}-next`,
      type: `${type} due`,
      note: null,
      image_url: null,
      created_at: formatISO(due),
    });
  }

  addUpcoming(lastWater?.created_at, plant.waterEvery, 'water');
  addUpcoming(lastFert?.created_at, plant.fertEvery, 'fertilize');

  return [...events, ...upcoming].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
