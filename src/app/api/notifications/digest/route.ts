import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const userId = await getCurrentUserId();
    const today = new Date().toISOString().slice(0, 10);
    const { data: tasks, error } = await supabaseAdmin
      .from("tasks")
      .select("id, plant_id, type, due_date")
      .eq("user_id", userId)
      .is("completed_at", null)
      .lte("due_date", today);
    if (error) throw error;

    const list = tasks || [];
    const count = list.length;
    const summary =
      count > 0
        ? `You have ${count} task${count === 1 ? "" : "s"} due or overdue today.`
        : "You're all caught up!";

    return NextResponse.json({ ok: true, summary, tasks: list });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
