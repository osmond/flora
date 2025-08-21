import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const { care_plan } = await req.json();
    const { data, error } = await supabase
      .from("plants")
      .update({ care_plan })
      .eq("id", id)
      .select();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PATCH /plants/[id] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
