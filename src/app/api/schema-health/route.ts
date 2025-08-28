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
    // Prefer information_schema to detect types precisely
    const typeQuery = `
      select table_name, column_name, data_type
      from information_schema.columns
      where table_schema = 'public' and (
        (table_name = 'plants' and column_name = 'id') or
        (table_name = 'events' and column_name = 'plant_id') or
        (table_name = 'tasks'  and column_name = 'plant_id')
      );
    `;
    let plantsIdType: string | null = null;
    let eventsIdType: string | null = null;
    let tasksIdType: string | null = null;
    try {
      const { data: columns } = await supabase.rpc('exec_sql', { sql: typeQuery } as any);
      // If Postgres function 'exec_sql' isn't available, fallback to sampling
      if (Array.isArray(columns)) {
        for (const c of columns) {
          if (c.table_name === 'plants' && c.column_name === 'id') plantsIdType = c.data_type;
          if (c.table_name === 'events' && c.column_name === 'plant_id') eventsIdType = c.data_type;
          if (c.table_name === 'tasks'  && c.column_name === 'plant_id') tasksIdType = c.data_type;
        }
      }
    } catch {}

    // Fallback to sampling if information_schema not accessible
    let plantRows: any[] = [];
    let eventRows: any[] = [];
    let taskRows: any[] = [];
    if (!plantsIdType || !eventsIdType || !tasksIdType) {
      const pr = await supabase.from("plants").select("id").limit(5);
      plantRows = pr.data || [];
      const er = await supabase.from("events").select("plant_id").limit(10);
      eventRows = er.data || [];
      const tr = await supabase.from("tasks").select("plant_id").limit(10);
      taskRows = tr.data || [];
      plantsIdType = plantsIdType || detectType(plantRows?.[0]?.id);
      eventsIdType = eventsIdType || detectType(eventRows?.[0]?.plant_id);
      tasksIdType  = tasksIdType  || detectType(taskRows?.[0]?.plant_id);
    }

    // FK coverage (best-effort): measure how many events/tasks reference existing plants
    let eventsCoverage = null as null | number;
    let tasksCoverage = null as null | number;

    // Group ids by type for safer in() filters
    const eventsIds = (eventRows || []).map((r: any) => r.plant_id).filter((v: any) => v != null);
    const taskIds = (taskRows || []).map((r: any) => r.plant_id).filter((v: any) => v != null);
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
        plants_id: plantsIdType || 'unknown',
        events_plant_id: eventsIdType || 'unknown',
        tasks_plant_id: tasksIdType || 'unknown',
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
