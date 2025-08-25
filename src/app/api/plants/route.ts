import { getCurrentUserId } from "@/lib/auth";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";
import cloudinary from "@/lib/cloudinary";
import db from "@/lib/db";
import { z } from "zod";
import { NextResponse } from "next/server";

const plantSchema = z.object({
  name: z.string().min(1),
  species: z.string().optional(),
  potSize: z.string().optional(),
  potMaterial: z.string().optional(),
  lightLevel: z.string().optional(),
  indoor: z.enum(["Indoor", "Outdoor"]).optional(),
  drainage: z.string().optional(),
  soilType: z.string().optional(),
  humidity: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("photo");
    const entries = Array.from(formData.entries()).filter(([k]) => k !== "photo");
    const data = Object.fromEntries(entries);
    const parsed = plantSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const userId = await getCurrentUserId();
    const plantData = {
      ...parsed.data,
      species: parsed.data.species?.trim() || "Unknown",
    };

    let upload: { secure_url: string; public_id: string } | null = null;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      upload = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({}, (err, result) => {
          if (err || !result) return reject(err);
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        });
        stream.end(buffer);
      });
    }

    const { error, data: inserted } = await supabaseAdmin
      .from("plants")
      .insert({ ...plantData, user_id: userId, image_url: upload?.secure_url })
      .select();

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const id = inserted?.[0]?.id as string | undefined;
    if (upload && id) {
      await db.photo.create({ data: { plantId: id, url: upload.secure_url } });
    }

    return NextResponse.json(inserted, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const { data, error } = await supabaseAdmin
      .from("plants")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
