import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";

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
      .eq("plant_id", /^\d+$/.test(String(plantId)) ? Number(plantId) : plantId)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? [], { status: 200 });
  } catch (e: unknown) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let plantId: string | number | null = null;
    let type: string | null = null;
    let note: string | null = null;
    let amount: number | null = null;
    let imageUrl: string | null = null;
    let tag: string | null = null;
    let file: File | null = null;

    if (!contentType || !contentType.includes("application/json")) {
      const form = await req.formData();
      const pidForm = form.get("plant_id")?.toString() || null;
      plantId = pidForm && /^\d+$/.test(pidForm) ? Number(pidForm) : pidForm;
      type = form.get("type")?.toString() || null;
      note = typeof form.get("note") === "string" ? (form.get("note") as string) : null;
      tag = form.get("tag")?.toString() || null;
      const amt = form.get("amount");
      amount = typeof amt === "string" && amt ? Number(amt) : null;
      const f = form.get("photo");
      file = f instanceof File ? f : null;
    } else {
      const body = await req.json();
      const pidBody = body?.plant_id ?? null;
      plantId = typeof pidBody === 'string' && /^\d+$/.test(pidBody) ? Number(pidBody) : pidBody;
      type = body?.type ?? null;
      note = typeof body?.note === "string" ? body.note : null;
      tag = typeof body?.tag === "string" ? body.tag : null;
      amount = body?.amount ?? null;
      imageUrl = typeof body?.photoUrl === "string" ? body.photoUrl : null;
    }

    if (!plantId || !type || typeof plantId !== "string" || typeof type !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    // Accept numeric ids or UUIDs based on your schema

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
      tag,
    };

    const { data, error } = await supabase.from("events").insert(payload).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const event = data?.[0] ?? null;
    return NextResponse.json({ event }, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
