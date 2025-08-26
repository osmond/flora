import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing SUPABASE env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: Request) {
  try {
    const supabase = supabaseServer();
    const { searchParams } = new URL(req.url);
    const plantId =
      searchParams.get("plant_id") ?? searchParams.get("plantId");
    if (!plantId)
      return NextResponse.json(
        { error: "plant_id is required" },
        { status: 400 },
      );

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("plant_id", plantId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let plantId: string | null = null;
    let type: string | null = null;
    let note: string | null = null;
    let amount: number | null = null;
    let imageUrl: string | null = null;
    let file: File | null = null;

    if (!contentType || !contentType.includes("application/json")) {
      const form = await req.formData();
      plantId = form.get("plant_id")?.toString() || null;
      type = form.get("type")?.toString() || null;
      note = typeof form.get("note") === "string" ? (form.get("note") as string) : null;
      const amt = form.get("amount");
      amount = typeof amt === "string" && amt ? Number(amt) : null;
      const f = form.get("photo");
      file = f instanceof File ? f : null;
    } else {
      const body = await req.json();
      plantId = body?.plant_id ?? null;
      type = body?.type ?? null;
      note = typeof body?.note === "string" ? body.note : null;
      amount = body?.amount ?? null;
      imageUrl = typeof body?.photoUrl === "string" ? body.photoUrl : null;
    }

    if (!plantId || !type || typeof plantId !== "string" || typeof type !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    if (!uuidRegex.test(plantId)) {
      return NextResponse.json({ error: "Invalid plant_id" }, { status: 400 });
    }

    const userId = await getCurrentUserId();
    const supabase = supabaseServer();
    let publicId: string | null = null;

    if (type === "photo") {
      if (file) {
        const upload = await new Promise<{ secure_url: string; public_id: string }>(async (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({}, (err, result) => {
            if (err || !result) return reject(err);
            resolve(result);
          });
          try {
            if (typeof (file as any).arrayBuffer === "function") {
              const arrayBuffer = await (file as any).arrayBuffer();
              stream.end(Buffer.from(arrayBuffer));
            } else if (typeof (file as any).stream === "function") {
              const arrayBuffer = await new Response((file as any).stream()).arrayBuffer();
              stream.end(Buffer.from(arrayBuffer));
            } else if (typeof (file as any).text === "function") {
              const text = await (file as any).text();
              stream.end(Buffer.from(text));
            } else {
              stream.end();
            }
          } catch (err) {
            stream.end();
          }
        });
        imageUrl = upload.secure_url;
        publicId = upload.public_id;
        await supabase.from("plants").update({ image_url: imageUrl }).eq("id", plantId);
      }
      if (!imageUrl) {
        return NextResponse.json({ error: "Photo required" }, { status: 400 });
      }
    }

    const payload = {
      plant_id: plantId,
      type,
      note,
      amount,
      image_url: imageUrl,
      public_id: publicId,
      user_id: userId,
    };

    const { data, error } = await supabase.from("events").insert(payload).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const event = data?.[0] ?? null;
    return NextResponse.json({ event }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
