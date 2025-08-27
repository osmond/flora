import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

const schema = z.object({
  plant_id: z.string().uuid(),
  feedback: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const userId = await getCurrentUserId();
    const supabase = supabaseAdmin();
    const { error: plantError } = await supabase
      .from("plants")
      .select("id")
      .eq("id", parsed.data.plant_id)
      .eq("user_id", userId)
      .single();
    if (plantError) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }
    const { error } = await supabase.from("events").insert({
      plant_id: parsed.data.plant_id,
      user_id: userId,
      type: "note",
      note: parsed.data.feedback,
    });
    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    if (err instanceof SupabaseEnvError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export const runtime = "edge";
