import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { action, days, reason } = await req.json();

  try {
    if (action === "complete") {
      const { error } = await supabase
        .from("tasks")
        .update({ completed_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", getCurrentUserId());
      if (error) throw error;
    } else if (action === "snooze") {
      let addDays = typeof days === "number" ? days : 1;
      if (reason === "Too busy") addDays = Math.max(addDays, 2);
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("due_date, plant_id")
        .eq("id", id)
        .eq("user_id", getCurrentUserId())
        .single();
      if (fetchError) throw fetchError;
      const due = new Date(data.due_date);
      due.setDate(due.getDate() + addDays);
      const updates: Record<string, unknown> = {
        due_date: due.toISOString().slice(0, 10),
        snooze_reason: reason ?? null,
      };
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .eq("user_id", getCurrentUserId());
      if (error) throw error;

      if (reason === "Soil still wet") {
        const { data: plantData, error: plantError } = await supabase
          .from("plants")
          .select("care_plan")
          .eq("id", data.plant_id)
          .eq("user_id", getCurrentUserId())
          .single();
        if (!plantError && plantData?.care_plan?.waterEvery) {
          const match = plantData.care_plan.waterEvery.match(/(\d+)/);
          if (match) {
            const newInterval = parseInt(match[1], 10) + 1;
            const newPlan = {
              ...plantData.care_plan,
              waterEvery: `${newInterval} days`,
            };
            await supabase
              .from("plants")
              .update({ care_plan: newPlan })
              .eq("id", data.plant_id)
              .eq("user_id", getCurrentUserId());
          }
        }
      }
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

