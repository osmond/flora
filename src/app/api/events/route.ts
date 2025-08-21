import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plant_id, type, note } = body;

    if (!plant_id || !type) {
      return NextResponse.json({ error: "plant_id and type are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("events")
      .insert([{ plant_id, type, note }])
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /events error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
