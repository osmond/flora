import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat =
    searchParams.get('lat') ?? process.env.WEATHER_LAT ?? '40.71';
  const lon =
    searchParams.get('lon') ?? process.env.WEATHER_LON ?? '-74.01';

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

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
  return NextResponse.json(days);
}

export const runtime = 'edge';
