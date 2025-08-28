import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";

export async function GET() {
  const results: any = {
    supabase: { ok: false },
    plants: { count: null as number | null },
    openai: { hasKey: Boolean(process.env.OPENAI_API_KEY), ok: false as boolean | null, status: null as number | null, error: null as string | null },
    weather: { ok: false as boolean, status: null as number | null },
  };

  // Supabase connectivity + plant count
  try {
    const supabase = supabaseAdmin();
    const { count, error } = await supabase
      .from("plants")
      .select("id", { count: "exact", head: true });
    if (error) throw error;
    results.supabase.ok = true;
    results.plants.count = count ?? 0;
  } catch (e) {
    results.supabase.ok = false;
    results.supabase.error = e instanceof Error ? e.message : String(e);
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json(results, { status: 503 });
    }
  }

  // OpenAI connectivity (lightweight models call)
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      });
      results.openai.status = res.status;
      results.openai.ok = res.ok;
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        results.openai.error = txt || res.statusText;
      }
    } catch (e) {
      results.openai.ok = false;
      results.openai.error = e instanceof Error ? e.message : String(e);
    }
  } else {
    results.openai.ok = null; // no key provided
  }

  // Weather API check (open-meteo)
  try {
    const lat = process.env.WEATHER_LAT ?? "40.71";
    const lon = process.env.WEATHER_LON ?? "-74.01";
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&past_days=1&timezone=auto`;
    const res = await fetch(url);
    results.weather.status = res.status;
    results.weather.ok = res.ok;
  } catch (e) {
    results.weather.ok = false;
  }

  return NextResponse.json(results, { status: results.supabase.ok ? 200 : 503 });
}

export const runtime = "nodejs";

