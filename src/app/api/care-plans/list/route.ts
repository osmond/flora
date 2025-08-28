import { NextResponse } from "next/server";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("plants")
      .select("id, nickname, room_id, water_every, fert_every, care_plan")
      .order("nickname", { ascending: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, plants: data ?? [] });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export const runtime = "nodejs";

