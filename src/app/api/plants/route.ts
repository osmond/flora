// src/app/api/plants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role for inserts
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const species = formData.get("species") as string;
    const common_name = formData.get("common_name") as string | null;
    const room = formData.get("room") as string | null;
    const pot_size = formData.get("pot_size") as string | null;
    const pot_material = formData.get("pot_material") as string | null;
    const care_plan = formData.get("care_plan");
    let image_url: string | undefined;

    if (!name) {
      return NextResponse.json({ error: "Plant name is required" }, { status: 400 });
    }

    const file = formData.get("photo");
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
          name,
          species,
          common_name,
          room,
          pot_size,
          pot_material,
          care_plan,
          image_url,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /plants error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("plants").select("*").order("name");

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
