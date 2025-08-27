import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";

const plantSchema = z.object({
  id: z.string().uuid().optional(),
  room_id: z.number().int().nullable().optional(),
  user_id: z.string(),
  nickname: z.string(),
  species_scientific: z.string(),
  species_common: z.string().nullable().optional(),
  pot_size: z.string().nullable().optional(),
  pot_material: z.string().nullable().optional(),
  drainage: z.string().nullable().optional(),
  soil_type: z.string().nullable().optional(),
  light_level: z.string().nullable().optional(),
  indoor: z.string().nullable().optional(),
  humidity: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  care_plan: z.any().nullable().optional(),
  archived: z.boolean().optional(),
  notifications_muted: z.boolean().optional(),
  created_at: z.string().optional(),
});

const eventSchema = z.object({
  id: z.string().uuid().optional(),
  plant_id: z.string().uuid(),
  user_id: z.string(),
  type: z.string(),
  note: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  public_id: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

const backupSchema = z.object({
  plants: z.array(plantSchema),
  events: z.array(eventSchema),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plants, events } = backupSchema.parse(body);

    const supabase = supabaseServer();

    if (plants.length) {
      const { error: plantError } = await supabase
        .from("plants")
        .upsert(plants, { onConflict: "id" });
      if (plantError) {
        return NextResponse.json({ error: plantError.message }, { status: 400 });
      }
    }

    if (events.length) {
      const { error: eventError } = await supabase
        .from("events")
        .upsert(events, { onConflict: "id" });
      if (eventError) {
        return NextResponse.json({ error: eventError.message }, { status: 400 });
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
