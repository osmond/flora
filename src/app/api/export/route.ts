import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { toCsv } from "@/lib/csv";

function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function GET(req: Request) {
  try {
    const supabase = supabaseServer();
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format")?.toLowerCase() || "json";

    const { data: plants, error: plantsError } = await supabase.from("plants").select("*");
    if (plantsError) {
      return NextResponse.json({ error: plantsError.message }, { status: 500 });
    }
    const { data: events, error: eventsError } = await supabase.from("events").select("*");
    if (eventsError) {
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    if (format === "csv") {
      const plantsCsv = toCsv(plants ?? []);
      const eventsCsv = toCsv(events ?? []);
      const csv = `plants\n${plantsCsv}\n\nevents\n${eventsCsv}\n`;
      return new NextResponse(csv, {
        status: 200,
        headers: { "Content-Type": "text/csv" },
      });
    }

    return NextResponse.json(
      { plants: plants ?? [], events: events ?? [] },
      { status: 200 },
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
