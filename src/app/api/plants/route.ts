import { NextResponse } from "next/server";
import { supabaseServer, SupabaseEnvError } from "@/lib/supabase/server";

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
    const body = await req.json();
    const supabase = supabaseServer();

    const payload = {
      nickname: (body?.nickname as string | undefined)?.trim() || null,
      species_scientific: (body?.speciesScientific as string | undefined) || null,
      species_common: (body?.speciesCommon as string | undefined) || null,
      room_id: (body?.room_id as number | undefined) ?? null,
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

    return NextResponse.json({ plant }, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
