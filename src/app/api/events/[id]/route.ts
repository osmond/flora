import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  let userId: string;
  try {
    userId = getCurrentUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("id, public_id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (data.public_id) {
      await cloudinary.uploader.destroy(data.public_id);
    }

    const { error: delError } = await supabaseAdmin
      .from("events")
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (delError) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
    return NextResponse.json(null, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
