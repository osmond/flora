import { describe, it, expect } from 'vitest';
import { generateWeeklyCareForecast } from '../src/lib/forecast';
import type { WeatherDay } from '../src/types/forecast';

const plants = [
  {
    id: '1',
    name: 'Monstera',
    waterEvery: '7 days',
    lastWateredAt: '2024-01-01',
  },
];

const weather: WeatherDay[] = [
  {
    date: '2024-01-08',
    tempMax: 20,
    tempMin: 10,
    precipitationChance: 30,
  },
];

describe('generateWeeklyCareForecast', () => {
  it('includes tasks and weather for the week', () => {
    const result = generateWeeklyCareForecast(
      plants,
      weather,
      new Date('2024-01-08'),
    );
    const day = result.find((d) => d.date === '2024-01-08');
    expect(day?.tasks).toHaveLength(1);
    expect(day?.weather?.tempMax).toBe(20);
  });
});

