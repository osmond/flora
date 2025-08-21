import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "../../../lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";


export const revalidate = 60;

export async function GET() {
  try {
    const userId = getCurrentUserId();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: dailyRows, error: dailyError } = await (supabase as any)
      .from("tasks")
      .select("day:date_trunc('day', completed_at), total:count(*)")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .group("day")
      .order("day");

    if (dailyError) throw dailyError;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: weeklyRows, error: weeklyError } = await (supabase as any)
      .from("tasks")
      .select("week:date_trunc('week', completed_at), total:count(*)")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .group("week")
      .order("week");

    if (weeklyError) throw weeklyError;

    type AggregatedRow = { day?: string; week?: string; total: number };

    const daily = (dailyRows ?? []).map((r: AggregatedRow) => ({
      date: r.day!,
      count: Number(r.total),
    }));

    const weekly = (weeklyRows ?? []).map((r: AggregatedRow) => ({
      week: r.week!,
      count: Number(r.total),
    }));

    return NextResponse.json({ daily, weekly });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
