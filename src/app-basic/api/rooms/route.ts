import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "../../../lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";


export async function GET() {
  try {
    const { data, error } = await supabase
      .from("plants")
      .select("room")
      .eq("user_id", getCurrentUserId())
      .not("room", "is", null)
      .neq("room", "");

    if (error) throw error;

    const rooms = Array.from(new Set((data ?? []).map((r) => r.room as string))).sort();

    return NextResponse.json({ data: rooms });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("GET /rooms error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

