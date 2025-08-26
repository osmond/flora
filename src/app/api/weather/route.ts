import { NextResponse } from 'next/server';

type CacheEntry = {
  lat: string;
  lon: string;
  timestamp: number;
  data: any;
};

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
let cache: CacheEntry | null = null;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat') ?? process.env.WEATHER_LAT ?? '40.71';
  const lon = searchParams.get('lon') ?? process.env.WEATHER_LON ?? '-74.01';

  if (
    cache &&
    cache.lat === lat &&
    cache.lon === lon &&
    Date.now() - cache.timestamp < CACHE_TTL
  ) {
    return NextResponse.json(cache.data);
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    return NextResponse.json({ error: 'Weather fetch failed' }, { status: 500 });
  }
  const data = await res.json();
  const daily = data.daily;
  const days = daily.time.map((date: string, idx: number) => ({
    date,
    tempMax: daily.temperature_2m_max[idx],
    tempMin: daily.temperature_2m_min[idx],
    precipitationChance: daily.precipitation_probability_max[idx],
  }));

  cache = { lat, lon, timestamp: Date.now(), data: days };
  return NextResponse.json(days);
}

export const runtime = 'edge';
