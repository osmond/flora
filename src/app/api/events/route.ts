import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";

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
    const body = await req.json();
    const plantId = body?.plant_id as string;
    const type = body?.type as string;
    if (!plantId || !type || typeof plantId !== "string" || typeof type !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const uuidRegex = /^[0-9a-fA-F-]{36}$/;
    if (!uuidRegex.test(plantId)) {
      return NextResponse.json({ error: "Invalid plant_id" }, { status: 400 });
    }

    const userId = await getCurrentUserId();
    const supabase = supabaseServer();
    const payload = {
      plant_id: plantId,
      type,
      note: typeof body?.note === "string" ? body.note : null,
      amount: body?.amount ?? null,
      photo_url: typeof body?.photoUrl === "string" ? body.photoUrl : null,
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
