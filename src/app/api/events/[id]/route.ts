import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "../../../../lib/config";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, plant_id, public_id")
      .eq("id", id)
      .single();
    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { error: authError } = await supabase
      .from("plants")
      .select("id")
      .eq("id", event.plant_id)
      .eq("user_id", getCurrentUserId())
      .single();
    if (authError) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);
    if (deleteError) {
      throw deleteError;
    }

    if (event.public_id) {
      try {
        await cloudinary.uploader.destroy(event.public_id);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("DELETE /events/[id] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
