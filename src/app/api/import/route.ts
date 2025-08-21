import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const rows = Array.isArray(body) ? body : body?.data;

    if (!Array.isArray(rows)) {
      return NextResponse.json(
        { error: "Expected JSON array or { data: [...] }" },
        { status: 400 },
      );
    }

    const userId = getCurrentUserId();
    const cleaned = rows.map((row: Record<string, unknown>) => {
      const { id, created_at, user_id, ...rest } = row as Record<string, unknown>; // eslint-disable-line @typescript-eslint/no-unused-vars
      return { ...rest, user_id: userId };
    });

    const { error } = await supabase.from("plants").insert(cleaned);
    if (error) throw error;

    return NextResponse.json({ inserted: cleaned.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

