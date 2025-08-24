import { getCurrentUserId } from "@/lib/auth";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = getCurrentUserId();
  const { error } = await supabaseAdmin
    .from("plants")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    return new Response("Database error", { status: 500 });
  }

  return new Response(null, { status: 200 });
}
