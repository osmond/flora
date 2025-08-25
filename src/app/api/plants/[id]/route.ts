import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Missing SUPABASE env vars");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  try {
    const id = Number(ctx.params.id);
    if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
