import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const userId = await getCurrentUserId();
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("events")
      .select("id, public_id")
      .eq("user_id", userId)
      .eq("id", id)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.public_id) {
      await cloudinary.uploader.destroy(data.public_id);
    }

    const { error: delError } = await supabase
      .from("events")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (delError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    if (err instanceof SupabaseEnvError) {
      return NextResponse.json({ error: err.message }, { status: 503 });
    }
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
