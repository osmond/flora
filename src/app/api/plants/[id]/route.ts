import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = supabaseServer();
    const builder = supabase.from("plants").select("*");
    let query: any = builder;
    if (typeof query.eq === "function") {
      query = query.eq("id", id);
      if (typeof query.eq === "function") {
        query = query.eq("archived", false);
      }
    }
    const { data, error } =
      typeof query.single === "function" ? await query.single() : await query;
    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(Array.isArray(data) ? data[0] : data, { status: 200 });
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
    const updates: Record<string, unknown> = {};
    if (body.nickname !== undefined) updates.nickname = body.nickname;
    if (body.species_scientific !== undefined)
      updates.species_scientific = body.species_scientific;
    if (body.species_common !== undefined)
      updates.species_common = body.species_common;
    if (body.room_id !== undefined) updates.room_id = body.room_id;
    if (body.image_url !== undefined) updates.image_url = body.image_url;
    if (body.archived !== undefined) updates.archived = body.archived;
    if (body.waterEvery !== undefined) updates.water_every = body.waterEvery;
    if (body.notificationsMuted !== undefined)
      updates.notifications_muted = body.notificationsMuted;
    const updateBuilder = supabase
      .from("plants")
      .update(updates)
      .eq("id", id)
      .select();
    let data: any;
    let error: any;
    if (typeof (updateBuilder as any).single === "function") {
      ({ data, error } = await (updateBuilder as any).single());
    } else {
      ({ data, error } = await updateBuilder);
    }
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

