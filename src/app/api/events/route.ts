import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { z } from "zod";
import { NextResponse } from "next/server";

// JSON body can log a note or a simple care event (e.g. watering)
const baseSchema = z.object({
  plant_id: z.string().uuid(),
});
const noteSchema = baseSchema.extend({
  type: z.literal("note"),
  note: z.string().min(1),
});
const careSchema = baseSchema.extend({
  type: z.enum(["water", "fertilize"]),
  note: z.string().optional(),
});
const jsonSchema = z.union([noteSchema, careSchema]);

const formSchema = z.object({
  plant_id: z.string().uuid(),
  type: z.literal("photo"),
});

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  try {
    const userId = getCurrentUserId();
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const parsed = jsonSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
      }
      const { data, error } = await supabaseAdmin
        .from("events")
        .insert({
          plant_id: parsed.data.plant_id,
          user_id: userId,
          type: parsed.data.type,
          note: parsed.data.note,
        })
        .select();
      if (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }
      return NextResponse.json(data, { status: 200 });
    }

    const formData = await req.formData();
    const plant_id = formData.get("plant_id");
    const type = formData.get("type");
    const file = formData.get("photo");
    const parsed = formSchema.safeParse({ plant_id, type });
    if (!parsed.success || !(file instanceof File)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const upload = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, result) => {
          if (err || !result) return reject(err);
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        });
        stream.end(buffer);
      },
    );

    const { data: inserted, error: insertError } = await supabaseAdmin
      .from("events")
      .insert({
        plant_id: parsed.data.plant_id,
        user_id: userId,
        type: "photo",
        image_url: upload.secure_url,
        public_id: upload.public_id,
      })
      .select();
    if (insertError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    await supabaseAdmin
      .from("plants")
      .update({ image_url: upload.secure_url })
      .eq("id", parsed.data.plant_id);

    return NextResponse.json(inserted, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
