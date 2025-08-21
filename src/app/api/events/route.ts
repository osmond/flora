import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const plant_id = formData.get("plant_id") as string | null;
      const type = (formData.get("type") as string | null) || "photo";
      const note = formData.get("note") as string | null;

      if (!plant_id || !type) {
        return NextResponse.json(
          { error: "plant_id and type are required" },
          { status: 400 },
        );
      }

      let image_url: string | undefined;
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
        .from("events")
        .insert([{ plant_id, type, note, image_url }])
        .select();

      if (error) throw error;
      return NextResponse.json({ data });
    }

    const body = await req.json();
    const { plant_id, type, note } = body;

    if (!plant_id || !type) {
      return NextResponse.json(
        { error: "plant_id and type are required" },
        { status: 400 },
      );
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
