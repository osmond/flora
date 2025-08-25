import type { WeatherDay } from '@/types/forecast';

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
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    return [];
  }
  const data: WeatherDay[] = await res.json();
  const cache: WeatherCache = { lat, lon, timestamp: Date.now(), data };
  localStorage.setItem(WEATHER_KEY, JSON.stringify(cache));
  return data;
}
