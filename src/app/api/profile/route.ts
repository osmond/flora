import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    const supabase = supabaseServer();
    const { data, error } = await supabase
      .from("profiles")
      .select("feature_flags")
      .eq("id", userId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json(
      { id: userId, featureFlags: (data.feature_flags as Record<string, unknown>) || {} },
      { status: 200 },
    );
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

