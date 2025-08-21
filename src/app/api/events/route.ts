import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

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

      const { error: plantCheckError } = await supabase
        .from("plants")
        .select("id")
        .eq("id", plant_id)
        .eq("user_id", getCurrentUserId())
        .single();
      if (plantCheckError) {
        return NextResponse.json({ error: "Plant not found" }, { status: 404 });
      }

      let image_url: string | undefined;
      const file = formData.get("photo");
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await new Promise<import("cloudinary").UploadApiResponse>((resolve, reject) =>
          cloudinary.uploader
            .upload_stream({ folder: "plant-photos" }, (error, result) =>
              error ? reject(error) : resolve(result!)
            )
            .end(buffer)
        );
        image_url = uploadResult.secure_url;
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

    const { error: plantCheckError } = await supabase
      .from("plants")
      .select("id")
      .eq("id", plant_id)
      .eq("user_id", getCurrentUserId())
      .single();
    if (plantCheckError) {
      return NextResponse.json({ error: "Plant not found" }, { status: 404 });
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
