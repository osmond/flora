import { getCurrentUserId } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logEvent } from "@/lib/analytics";
import { addDays, formatISO, parseISO } from "date-fns";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{ id: string }>;
}

type CompleteAction = { action: "complete" };
type SnoozeAction = { action: "snooze"; days: number; reason?: string };
type RequestBody = CompleteAction | SnoozeAction;

export async function PATCH(req: Request, { params }: Params) {
  try {
    const userId = await getCurrentUserId();
    const { id } = await params;

    let body: RequestBody;
    try {
      body = (await req.json()) as RequestBody;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (body.action === "complete") {
      const { data: task, error: taskError } = await supabaseAdmin
        .from("tasks")
        .select("plant_id, type")
        .eq("id", id)
        .eq("user_id", userId)
        .single();
      if (taskError || !task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      const { error } = await supabaseAdmin
        .from("tasks")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", userId);
      if (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const { error: eventError } = await supabaseAdmin.from("events").insert({
        plant_id: task.plant_id as string,
        user_id: userId,
        type: task.type as string,
      });
      if (eventError) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      await logEvent("task_completed", { task_id: id });
      return NextResponse.json({}, { status: 200 });
    }

    if (body.action === "snooze") {
      const days = typeof body.days === "number" ? body.days : 0;
      const reason = body.reason as string | undefined;

      const { data: task, error: taskError } = await supabaseAdmin
        .from("tasks")
        .select("due_date, plant_id")
        .eq("id", id)
        .eq("user_id", userId)
        .single();
      if (taskError || !task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      const due = parseISO(task.due_date as string);
      const newDue = formatISO(addDays(due, days), { representation: "date" });

      const { error: updateError } = await supabaseAdmin
        .from("tasks")
        .update({ due_date: newDue, snooze_reason: reason })
        .eq("id", id)
        .eq("user_id", userId);
      if (updateError) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const { data: plant } = await supabaseAdmin
        .from("plants")
        .select("care_plan")
        .eq("id", task.plant_id as string)
        .eq("user_id", userId)
        .single();

      const current = plant?.care_plan as { waterEvery?: string } | null;
      if (current?.waterEvery) {
        const match = current.waterEvery.match(/(\d+)/);
        const interval = match ? parseInt(match[1], 10) : 0;
        const updatedPlan = {
          ...current,
          waterEvery: `${interval + days} days`,
        };
        await supabaseAdmin
          .from("plants")
          .update({ care_plan: updatedPlan })
          .eq("id", task.plant_id as string)
          .eq("user_id", userId);
      }

      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

