import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a server client using service role (server-only).
function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = supabaseServer();
    const payload = {
      nickname: body?.nickname ?? null,
      species_scientific: body?.speciesScientific ?? null,
      species_common: body?.speciesCommon ?? null,
    };
    const { data, error } = await supabase.from("plants").insert(payload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ plant: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
