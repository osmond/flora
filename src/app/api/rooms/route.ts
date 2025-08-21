export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("plants")
      .select("room")
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

