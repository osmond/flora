import type { WeatherDay } from '@/types/forecast';

const CACHE_KEY = 'flora-weather';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetches weather data for the given coordinates and caches the result.
 */
export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherDay[]> {
  if (typeof window === 'undefined') return [];

  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as { timestamp: number; data: WeatherDay[] };
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        return parsed.data;
      }
    } catch {
      // ignore parse errors and fall back to network
    }
  }

  const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
  const data = (await res.json()) as WeatherDay[];
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ timestamp: Date.now(), data })
  );
  return data;
}
