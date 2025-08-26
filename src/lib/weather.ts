import type { WeatherDay } from '@/types/forecast';
import { apiFetch } from '@/lib/api';

const WEATHER_KEY = 'flora.weather';
const WEATHER_TTL = 30 * 60 * 1000; // 30 minutes

type WeatherCache = {
  lat: number;
  lon: number;
  timestamp: number;
  data: WeatherDay[];
};

export async function getWeather(lat: number, lon: number): Promise<WeatherDay[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  const cached = localStorage.getItem(WEATHER_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as WeatherCache;
      if (
        parsed.lat === lat &&
        parsed.lon === lon &&
        Date.now() - parsed.timestamp < WEATHER_TTL
      ) {
        return parsed.data;
      }
    } catch {
      localStorage.removeItem(WEATHER_KEY);
    }
  }
  try {
    const data = await apiFetch<WeatherDay[]>(`/api/weather?lat=${lat}&lon=${lon}`);
    const cache: WeatherCache = { lat, lon, timestamp: Date.now(), data };
    localStorage.setItem(WEATHER_KEY, JSON.stringify(cache));
    return data;
  } catch {
    return [];
  }
}
