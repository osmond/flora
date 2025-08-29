import { NextResponse } from "next/server";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";
import cloudinary from "@/lib/cloudinary";
import { generateCarePlan } from "@/lib/llm";


export async function GET() {
  try {
    const supabase = supabaseServer();
    const builder = supabase.from("plants").select("*");
    let query: any = builder;
    if (typeof query.eq === "function") {
      query = query.eq("archived", false);
    }
    let result: any;
    if (typeof query.order === "function") {
      result = await query.order("created_at", { ascending: false });
    } else {
      result = await query;
    }
    const { data, error } = result;
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
    let nickname: string | null = null;
    let speciesScientific: string | null = null;
    let speciesCommon: string | null = null;
    let roomId: number | null = null;
    let file: File | null = null;

    if (!contentType || contentType.includes("application/json")) {
      const body = await req.json();
      nickname = (body?.nickname as string | undefined)?.trim() || null;
      speciesScientific = body?.speciesScientific || null;
      speciesCommon = body?.speciesCommon || null;
      roomId = (body?.room_id as number | undefined) ?? null;
    } else {
      const form = await req.formData();
      nickname = form.get("nickname")?.toString() || null;
      speciesScientific = form.get("speciesScientific")?.toString() || null;
      speciesCommon = form.get("speciesCommon")?.toString() || null;
      const room = form.get("room_id")?.toString();
      roomId = room ? Number(room) : null;
      const f = form.get("photo");
      file = f instanceof File ? f : null;
    }

    const supabase = supabaseServer();

    const payload = {
      nickname,
      species_scientific: speciesScientific,
      species_common: speciesCommon,
      room_id: roomId,
    };

    const insertBuilder = supabase.from("plants").insert(payload).select();
    let data: any;
    let error: any;
    if (typeof (insertBuilder as any).single === "function") {
      ({ data, error } = await (insertBuilder as any).single());
    } else {
      ({ data, error } = await insertBuilder);
    }
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const plant = Array.isArray(data) ? data[0] : data;

    // Synchronously generate care plan; fallback to sensible defaults
    let plan = null as null | { water_every: string; fert_every: string; notes?: string };
    try {
      plan = await generateCarePlan({
        species: speciesCommon || speciesScientific || nickname || undefined,
        nickname: nickname || undefined,
        climate: { lat: process.env.WEATHER_LAT, lon: process.env.WEATHER_LON, avgTempC: null, rainChancePct: null },
      });
    } catch {}
    const fallbackPlan = { water_every: "7 days", fert_every: "30 days" };
    const finalPlan = plan ?? fallbackPlan;
    try {
      await supabase
        .from("plants")
        .update({
          care_plan: { water_every: finalPlan.water_every, fert_every: finalPlan.fert_every, notes: finalPlan.notes },
          water_every: finalPlan.water_every,
          fert_every: finalPlan.fert_every,
        })
        .eq("id", plant.id);
      plant.care_plan = { water_every: finalPlan.water_every, fert_every: finalPlan.fert_every, notes: finalPlan.notes };
      plant.water_every = finalPlan.water_every;
      plant.fert_every = finalPlan.fert_every;
    } catch {}

    if (file) {
      const upload = await new Promise<{ secure_url: string; public_id: string }>(
        async (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({}, (err, result) => {
            if (err || !result) return reject(err);
            resolve(result as { secure_url: string; public_id: string });
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
        },
      );
      const imageUrl = upload.secure_url;
      const { error: updateError } = await supabase
        .from("plants")
        .update({ image_url: imageUrl })
        .eq("id", plant.id);
      if (updateError)
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      plant.image_url = imageUrl;
    }

    return NextResponse.json({ plant }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
