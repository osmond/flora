import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { generateCarePlan } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing OPENAI_API_KEY" },
        { status: 503 },
      );
    }
    const supabase = supabaseAdmin();
    const { data: plants } = await supabase
      .from("plants")
      .select("id, nickname, species_common, water_every, fert_every")
      .order("created_at", { ascending: true });

    // Optional: basic climate signals (can be extended with your /api/weather)
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

    let updated = 0;
    let attempted = 0;
    for (const p of plants || []) {
      const name = (p as any).species_common || (p as any).nickname || "";
      const currentWater = (p as any).water_every ?? null;
      const currentFert = (p as any).fert_every ?? null;
      const plan = await generateCarePlan({
        species: String(name),
        nickname: (p as any).nickname ?? null,
        climate: { lat, lon, avgTempC, rainChancePct },
      });
      attempted++;
      if (plan && (plan.water_every !== currentWater || plan.fert_every !== currentFert)) {
        const { error: upErr } = await supabase
          .from("plants")
          .update({ water_every: plan.water_every, fert_every: plan.fert_every })
          .eq("id", (p as any).id);
        if (upErr) throw upErr;
        updated++;
      }
    }

    if (attempted === 0) {
      return NextResponse.json(
        { ok: false, error: "OpenAI call did not run (check network)" },
        { status: 503 },
      );
    }

    return NextResponse.json({ ok: true, updated });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export const runtime = "nodejs";
