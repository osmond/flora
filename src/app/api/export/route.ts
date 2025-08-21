import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => {
    if (val === null || val === undefined) return "";
    return `"${String(val).replace(/"/g, '""')}"`;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => escape(row[h as keyof T])).join(","),
    ),
  ];
  return lines.join("\n");
}

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

