import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { generateCarePlan } from "@/lib/llm";

function isUUID(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!isUUID(id)) {
      return NextResponse.json({ ok: false, error: "Invalid plant id (UUID required)" }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ ok: false, error: "Missing OPENAI_API_KEY" }, { status: 503 });
    }

    const supabase = supabaseAdmin();
    const { data: plant, error } = await supabase
      .from("plants")
      .select("id, nickname, species_common")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!plant) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    // Light climate context
    const lat = process.env.WEATHER_LAT ?? "40.71";
    const lon = process.env.WEATHER_LON ?? "-74.01";
    let avgTempC: number | null = null;
    let rainChancePct: number | null = null;
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&past_days=7&timezone=auto`
      );
      if (weatherRes.ok) {
        const w = await weatherRes.json();
        const max = w?.daily?.temperature_2m_max?.[0];
        const min = w?.daily?.temperature_2m_min?.[0];
        avgTempC = typeof max === "number" && typeof min === "number" ? (max + min) / 2 : null;
        rainChancePct = w?.daily?.precipitation_probability_max?.[0] ?? null;
      }
    } catch {}

    const plan = await generateCarePlan({
      species: (plant as any).species_common ?? (plant as any).nickname,
      nickname: (plant as any).nickname,
      climate: { lat, lon, avgTempC, rainChancePct },
    });
    if (!plan) return NextResponse.json({ ok: false, error: "OpenAI didn't return a plan" }, { status: 502 });

    const { error: upErr } = await supabase
      .from("plants")
      .update({ care_plan: { water_every: plan.water_every, fert_every: plan.fert_every, notes: plan.notes } })
      .eq("id", id);
    if (upErr) throw upErr;

    return NextResponse.json({ ok: true, updated: 1, plan });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export const runtime = "nodejs";

