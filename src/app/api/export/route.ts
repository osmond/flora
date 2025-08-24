import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { toCsv } from "@/lib/csv";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") ?? "json";

    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("user_id", getCurrentUserId())
      .order("name");

    if (error) throw error;

    if (format === "csv") {
      const csv = toCsv(data);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": "attachment; filename=plants.csv",
        },
      });
    }

    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

