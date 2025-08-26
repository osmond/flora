import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from("notification_settings")
      .select("quiet_start, quiet_end")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return NextResponse.json({ settings: data }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const supabase = supabaseServer();
    const userId = await getCurrentUserId();
    const body = await req.json();
    const updates = {
      user_id: userId,
      quiet_start: body.quietStart ?? null,
      quiet_end: body.quietEnd ?? null,
    };
    const { data, error } = await supabase
      .from("notification_settings")
      .upsert(updates)
      .select("quiet_start, quiet_end")
      .single();
    if (error) throw error;
    return NextResponse.json({ settings: data }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
