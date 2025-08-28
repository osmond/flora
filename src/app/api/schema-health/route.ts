import { NextResponse } from "next/server";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";

function detectType(val: unknown): "uuid" | "bigint" | "text" | "unknown" {
  if (typeof val === "number") return "bigint";
  if (typeof val === "string") {
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRe.test(val) ? "uuid" : "text";
  }
  return "unknown";
}

export async function GET() {
  try {
    const supabase = supabaseServer();

    // Sample ids
    const { data: plantRows } = await supabase.from("plants").select("id").limit(5);
    const { data: eventRows } = await supabase.from("events").select("plant_id").limit(10);
    const { data: taskRows } = await supabase.from("tasks").select("plant_id").limit(10);

    const plantIdSample = plantRows?.[0]?.id ?? null;
    const eventsIds = (eventRows || []).map((r: any) => r.plant_id).filter((v: any) => v != null);
    const taskIds = (taskRows || []).map((r: any) => r.plant_id).filter((v: any) => v != null);

    const plantsIdType = detectType(plantIdSample);
    const eventsIdType = detectType(eventsIds[0]);
    const tasksIdType = detectType(taskIds[0]);

    // FK coverage (best-effort): measure how many events/tasks reference existing plants
    let eventsCoverage = null as null | number;
    let tasksCoverage = null as null | number;

    // Group ids by type for safer in() filters
    const evNums = eventsIds.filter((v: any) => typeof v === "number") as number[];
    const evStrs = eventsIds.filter((v: any) => typeof v === "string") as string[];
    const tkNums = taskIds.filter((v: any) => typeof v === "number") as number[];
    const tkStrs = taskIds.filter((v: any) => typeof v === "string") as string[];

    async function countExisting(idsNum: number[], idsStr: string[]) {
      let found = 0;
      let total = idsNum.length + idsStr.length;
      if (total === 0) return null;
      if (idsNum.length) {
        const { data } = await supabase.from("plants").select("id").in("id", idsNum);
        found += (data || []).length;
      }
      if (idsStr.length) {
        const { data } = await supabase.from("plants").select("id").in("id", idsStr);
        found += (data || []).length;
      }
      return Math.round((found / total) * 100);
    }

    eventsCoverage = await countExisting(evNums, evStrs);
    tasksCoverage = await countExisting(tkNums, tkStrs);

    return NextResponse.json({
      ok: true,
      types: {
        plants_id: plantsIdType,
        events_plant_id: eventsIdType,
        tasks_plant_id: tasksIdType,
      },
      fkCoverage: {
        events_to_plants_percent: eventsCoverage,
        tasks_to_plants_percent: tasksCoverage,
      },
      samples: {
        plants: plantRows || [],
        events: eventRows || [],
        tasks: taskRows || [],
      },
    });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export const runtime = "nodejs";

