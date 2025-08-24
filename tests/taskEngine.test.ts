import { describe, it, expect } from 'vitest';
import { generateTasks, hydrateTimeline } from '../src/lib/tasks';
import type { CareEvent } from '../src/types';

describe('generateTasks', () => {
  it('creates a water task when interval has passed', () => {
    const plants = [
      {
        id: '1',
        name: 'Monstera',
        waterEvery: '7 days',
        lastWateredAt: '2024-01-01',
      },
    ];
    const tasks = generateTasks(plants, new Date('2024-01-08'));
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ plantName: 'Monstera', type: 'water' });
  });

  it('skips tasks that are not yet due', () => {
    const plants = [
      {
        id: '1',
        name: 'Monstera',
        waterEvery: '7 days',
        lastWateredAt: '2024-01-05',
      },
    ];
    const tasks = generateTasks(plants, new Date('2024-01-08'));
    expect(tasks).toHaveLength(0);
  });

  it('creates a fertilize task when interval has passed', () => {
    const plants = [
      {
        id: '1',
        name: 'Fern',
        fertEvery: '30 days',
        lastFertilizedAt: '2024-01-01',
      },
    ];
    const tasks = generateTasks(plants, new Date('2024-02-01'));
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ plantName: 'Fern', type: 'fertilize' });
  });

  it('handles week-based intervals', () => {
    const plants = [
      {
        id: '1',
        name: 'Rose',
        waterEvery: '2 weeks',
        lastWateredAt: '2024-01-01',
      },
    ];
    const tasks = generateTasks(plants, new Date('2024-01-15'));
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toMatchObject({ plantName: 'Rose', type: 'water' });
  });
});

describe('hydrateTimeline', () => {
  it('adds upcoming care events based on intervals', () => {
    const events: CareEvent[] = [
      {
        id: '1',
        type: 'water',
        note: null,
        image_url: null,
        created_at: '2024-01-01',
      },
    ];
    const timeline = hydrateTimeline(events, {
      id: 'plant1',
      waterEvery: '7 days',
      fertEvery: null,
    });
    const hasUpcoming = timeline.some((e) => e.type === 'water due');
    expect(hasUpcoming).toBe(true);
  });
});
