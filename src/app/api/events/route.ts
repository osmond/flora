import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";


const allowedTypes = ["note", "photo"] as const;

const fileMetadataSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().int().nonnegative(),
});

const eventSchema = z
  .object({
    plant_id: z.string().uuid(),
    type: z.enum(allowedTypes),
    note: z.string().optional(),
    file: fileMetadataSchema.optional(),
  })
  .refine((data) => (data.type === "photo" ? !!data.file : true), {
    message: "file is required when type is 'photo'",
    path: ["file"],
  });

function serializeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }
  return String(err);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let parsed: z.infer<typeof eventSchema>;
    let file: File | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const maybeFile = formData.get("photo");
      file = maybeFile instanceof File ? maybeFile : undefined;
      try {
        parsed = eventSchema.parse({
          plant_id: formData.get("plant_id"),
          type: formData.get("type"),
          note: formData.get("note") ?? undefined,
          file: file
            ? { name: file.name, type: file.type, size: file.size }
            : undefined,
        });
      } catch (err) {
        const message = err instanceof z.ZodError ? err.flatten() : err;
        return NextResponse.json({ error: message }, { status: 400 });
      }
    } else {
      const json = await req.json();
      try {
        parsed = eventSchema.parse(json);
      } catch (err) {
        const message = err instanceof z.ZodError ? err.flatten() : err;
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }

    const { plant_id, type, note } = parsed;

    if (type === "photo" && !file) {
      return NextResponse.json(
        { error: "file upload required" },
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
  let public_id: string | undefined;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    try {
      const uploadResult = await new Promise<import("cloudinary").UploadApiResponse>((resolve, reject) =>
        cloudinary.uploader
          .upload_stream({ folder: "plant-photos" }, (error, result) =>
            error ? reject(error) : resolve(result!)
          )
          .end(buffer)
      );
      image_url = uploadResult.secure_url;
      public_id = uploadResult.public_id;
    } catch (err) {
      const message = serializeError(err);
      console.error("Error uploading to Cloudinary:", err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from("events")
    .insert([{ plant_id, type, note, image_url, public_id }])
    .select();

    if (error) throw error;

    if (type === "photo" && image_url) {
      const { error: updateError } = await supabase
        .from("plants")
        .update({ image_url })
        .eq("id", plant_id)
        .eq("user_id", getCurrentUserId())
        .is("image_url", null);
      if (updateError) {
        console.error("Error updating plant image_url:", updateError.message);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = serializeError(err);
    console.error("POST /events error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

