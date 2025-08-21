import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { action, days } = await req.json();

  try {
    if (action === "complete") {
      const { error } = await supabase
        .from("tasks")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    } else if (action === "snooze") {
      const addDays = typeof days === "number" ? days : 1;
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("due_date")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;
      const due = new Date(data.due_date);
      due.setDate(due.getDate() + addDays);
      const { error } = await supabase
        .from("tasks")
        .update({ due_date: due.toISOString().slice(0, 10) })
        .eq("id", id);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PATCH /api/tasks/:id error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

