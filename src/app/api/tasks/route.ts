import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "7", 10);
    const endDate = new Date(Date.now() + days * 86400000);
    const end = endDate.toISOString().slice(0, 10);
    const supabase = supabaseAdmin();

    const { data: tasks, error: tErr } = await supabase
      .from("tasks")
      .select("id, plant_id, type, due_date, completed_at")
      .eq("user_id", userId)
      .lte("due_date", end)
      .is("completed_at", null)
      .order("due_date", { ascending: true });
    if (tErr) throw tErr;

    const { data: plants, error: pErr } = await supabase
      .from("plants")
      .select("id, nickname")
      .eq("user_id", userId);
    if (pErr) throw pErr;

    const plantMap = new Map<string, string>();
    for (const p of plants || []) {
      plantMap.set(p.id as string, (p as any).nickname as string);
    }

    const result = (tasks || []).map((t) => ({
      id: t.id as string,
      plantId: t.plant_id as string,
      plantName: plantMap.get(t.plant_id as string) || "Unknown",
      type: t.type as string,
      due: t.due_date as string,
    }));

    return NextResponse.json({ tasks: result }, { status: 200 });
  } catch (err) {
    if (err instanceof SupabaseEnvError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

