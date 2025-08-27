import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";

// Scheduled endpoint to check for due and overdue tasks.
export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const supabase = supabaseAdmin();
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("id, due_date")
      .lte("due_date", today)
      .is("completed_at", null);
    if (error) throw error;

    let due = 0;
    let overdue = 0;
    for (const t of tasks || []) {
      const dueDate = t.due_date as string;
      if (dueDate === today) due++;
      else overdue++;
    }

    console.log(
      `[${new Date().toISOString()}] Checked tasks: ${overdue} overdue, ${due} due.`
    );

    return NextResponse.json({ ok: true, overdue, due });
  } catch (err) {
    if (err instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
    }
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

