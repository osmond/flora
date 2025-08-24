import { describe, it, expect } from 'vitest';
import { generateTasks } from '../src/lib/tasks';

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
});
