import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    const plantId = searchParams.get("plantId");
    if (!plantId) return NextResponse.json({ error: "plantId is required" }, { status: 400 });

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("plant_id", Number(plantId))
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
    const body = await req.json();
    const supabase = supabaseServer();
    const payload = {
      plant_id: Number(body?.plantId),
      type: body?.type as string,
      amount: body?.amount ?? null,
      note: (body?.note as string | undefined) ?? null,
      photo_url: (body?.photoUrl as string | undefined) ?? null,
    };

    if (!payload.plant_id || !payload.type) {
      return NextResponse.json({ error: "plantId and type are required" }, { status: 400 });
    }

    const { data, error } = await supabase.from("events").insert(payload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ event: data }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
