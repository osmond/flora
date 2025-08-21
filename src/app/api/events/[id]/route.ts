import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, plant_id, image_public_id")
      .eq("id", id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { error: ownershipError } = await supabase
      .from("plants")
      .select("id")
      .eq("id", event.plant_id)
      .eq("user_id", getCurrentUserId())
      .single();

    if (ownershipError) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    if (event.image_public_id) {
      try {
        await cloudinary.uploader.destroy(event.image_public_id);
      } catch (err) {
        console.error("Error deleting Cloudinary image:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("DELETE /events/:id error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

