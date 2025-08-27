import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { addDays, formatISO, parseISO } from "date-fns";

function parseInterval(v?: string | null): number | null {
  if (!v) return null;
  const m = String(v).toLowerCase().match(/(\d+)\s*(day|week|month|year)s?/);
  if (!m) return null;
  const q = parseInt(m[1], 10);
  const unit = m[2];
  return unit === "day"
    ? q
    : unit === "week"
    ? q * 7
    : unit === "month"
    ? q * 30
    : unit === "year"
    ? q * 365
    : null;
}

export async function POST() {
  try {
    const supabase = supabaseAdmin();
    const today = new Date();
    const horizon = addDays(today, 14);
    const horizonStr = formatISO(horizon, { representation: "date" });

    // Load plants
    const { data: plants } = await supabase
      .from("plants")
      .select("id, nickname, water_every, fert_every");

    // Load recent events for last 180 days
    const since = formatISO(addDays(today, -180));
    const { data: events } = await supabase
      .from("events")
      .select("plant_id, type, created_at")
      .gte("created_at", since);

    // Load existing tasks in window
    const { data: existingTasks } = await supabase
      .from("tasks")
      .select("plant_id, type, due_date, completed_at");

    const have = new Set(
      (existingTasks || []).map(
        (t: any) => `${t.plant_id}|${t.type}|${t.due_date}`
      )
    );

    const rows: any[] = [];
    for (const p of plants || []) {
      const pid = (p as any).id;
      const waterDays = parseInterval((p as any).water_every);
      const fertDays = parseInterval((p as any).fert_every);
      const pevents = (events || []).filter((e: any) => e.plant_id === pid);
      const lastWater = pevents.filter((e) => e.type === "water").sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.created_at;
      const lastFert = pevents.filter((e) => e.type === "fertilize").sort((a, b) => b.created_at.localeCompare(a.created_at))[0]?.created_at;

      function schedule(type: "water" | "fertilize", days: number | null, lastISO?: string) {
        if (days == null) return;
        const start = lastISO ? parseISO(lastISO) : today;
        let next = addDays(start, days);
        while (next <= horizon) {
          const due = formatISO(next, { representation: "date" });
          const key = `${pid}|${type}|${due}`;
          if (!have.has(key)) {
            rows.push({ plant_id: pid, type, due_date: due });
            have.add(key);
          }
          next = addDays(next, days);
        }
      }

      schedule("water", waterDays, lastWater);
      schedule("fertilize", fertDays, lastFert);
    }

    let inserted = 0;
    if (rows.length) {
      const { data, error } = await supabase.from("tasks").insert(rows).select();
      if (error) throw error;
      inserted = data?.length ?? 0;
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

