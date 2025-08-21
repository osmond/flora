// src/app/api/plants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be service role for inserts
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, species, common_name, care_plan } = body;

    if (!name) {
      return NextResponse.json({ error: "Plant name is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("plants")
      .insert([
        {
          name,
          species,
          common_name,
          care_plan,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("POST /plants error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("plants").select("*").order("name");

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
