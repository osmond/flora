import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing SUPABASE env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", userId)
      .eq("id", id);
    if (error || !data || data.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data[0], { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.species !== undefined) updates.species = body.species;
    if (body.image_url !== undefined) updates.image_url = body.image_url;
    const { data, error } = await supabase
      .from("plants")
      .update(updates)
      .eq("user_id", userId)
      .eq("id", id)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const updated = Array.isArray(data) ? data[0] : data;
    return NextResponse.json({ plant: updated }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const { error } = await supabase
      .from("plants")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({}, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

