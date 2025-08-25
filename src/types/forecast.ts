import type { Task } from './task';

export type WeatherDay = {
  date: string; // ISO date string
  tempMax: number;
  tempMin: number;
  precipitationChance: number;
};

export type DayForecast = {
  date: string; // ISO date string
  tasks: Task[];
  weather?: WeatherDay;
};

