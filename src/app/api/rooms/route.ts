import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "../../../lib/config";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

