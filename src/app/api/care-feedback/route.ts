import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "../../../lib/config";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const schema = z.object({
  plant_id: z.string().uuid(),
  feedback: z.enum(["helpful", "not_helpful"]),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { plant_id, feedback } = schema.parse(json);

    const { error: plantCheckError } = await supabase
      .from("plants")
      .select("id")
      .eq("id", plant_id)
      .eq("user_id", getCurrentUserId())
      .single();
    if (plantCheckError) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("events")
      .insert([{ plant_id, type: "feedback", note: feedback }]);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /care-feedback error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
