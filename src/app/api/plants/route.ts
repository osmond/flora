// src/app/api/plants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import { getCurrentUserId } from "../../../lib/auth";
import { logEvent } from "../../../lib/analytics";
import { z } from "zod";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "../../../lib/config";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY, // must be service role for inserts
);

export const plantSchema = z.object({
  name: z.string().min(1),
  species: z.string().min(1),
  common_name: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  pot_size: z.string().optional().nullable(),
  pot_material: z.string().optional().nullable(),
  drainage: z.string().optional().nullable(),
  soil_type: z.string().optional().nullable(),
  light_level: z.string().optional().nullable(),
  indoor: z.string().optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  humidity: z.coerce.number().min(0).max(100).optional().nullable(),
  care_plan: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawData = Object.fromEntries(formData.entries());
    const file = rawData.photo;
    delete (rawData as Record<string, unknown>).photo;

    const parsed = plantSchema.safeParse(rawData);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      name,
      species,
      common_name,
      room,
      pot_size,
      pot_material,
      drainage,
      soil_type,
      light_level,
      indoor,
      latitude,
      longitude,
      humidity,
      care_plan,
    } = parsed.data;
    let image_url: string | undefined;

    if (file instanceof File) {
      const bytes = await file.arrayBuffer();
      const fileName = `${randomUUID()}-${file.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from("plant-photos")
        .upload(fileName, new Uint8Array(bytes), {
          contentType: file.type,
        });
      if (storageError) throw storageError;
      const { data: publicUrl } = supabase.storage
        .from("plant-photos")
        .getPublicUrl(storageData.path);
      image_url = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("plants")
      .insert([
        {
          user_id: getCurrentUserId(),
          name,
          species,
          common_name: common_name ?? null,
          room: room ?? null,
          pot_size: pot_size ?? null,
          pot_material: pot_material ?? null,
          drainage: drainage ?? null,
          soil_type: soil_type ?? null,
          light_level: light_level ?? null,
          indoor: indoor ?? null,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          humidity: humidity ?? null,
          care_plan: care_plan ?? null,
          image_url,
        },
      ])
      .select();

    if (error) throw error;

    await logEvent("plant_created", { plant_id: data?.[0]?.id });

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /plants error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", getCurrentUserId())
      .order("name");

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
