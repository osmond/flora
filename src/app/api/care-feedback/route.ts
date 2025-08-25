import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  plant_id: z.string().uuid(),
  feedback: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response("Invalid data", { status: 400 });
    }
    const userId = getCurrentUserId();
    const { error: plantError } = await supabaseAdmin
      .from("plants")
      .select("id")
      .eq("id", parsed.data.plant_id)
      .eq("user_id", userId)
      .single();
    if (plantError) {
      return new Response("Plant not found", { status: 404 });
    }
    const { error } = await supabaseAdmin.from("events").insert({
      plant_id: parsed.data.plant_id,
      user_id: userId,
      type: "note",
      note: parsed.data.feedback,
    });
    if (error) {
      return new Response("Database error", { status: 500 });
    }
    return new Response(null, { status: 200 });
  } catch {
    return new Response("Server error", { status: 500 });
  }
}

export const runtime = "edge";
