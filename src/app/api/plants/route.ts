// src/app/api/plants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role for inserts
);

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name") as string | null;
    const species = (form.get("species") as string) || null;
    const common_name = (form.get("common_name") as string) || null;
    const file = form.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Plant name is required" }, { status: 400 });
    }

    let image_url: string | undefined;
    if (file && file.size > 0) {
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("plant-photos")
        .upload(fileName, file, { contentType: file.type });
      if (uploadError) throw uploadError;
      const { data: publicUrl } = supabase.storage
        .from("plant-photos")
        .getPublicUrl(uploadData.path);
      image_url = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("plants")
      .insert([
        {
          name,
          species,
          common_name,
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
