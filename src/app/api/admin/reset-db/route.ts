import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getDemoPlants } from "@/lib/demoData";

export async function POST(req: Request) {
  try {
    if (process.env.ADMIN_MODE !== "1") {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    const body = await req.json().catch(() => ({} as any));
    const seed: boolean = Boolean(body?.seed);
    const supabase = supabaseAdmin();

    // Delete all rows from events, tasks, plants (keep rooms)
    await supabase.from("events").delete().gte("created_at", "1970-01-01");
    await supabase.from("tasks").delete().gte("due_date", "1900-01-01");
    await supabase.from("plants").delete().gte("created_at", "1970-01-01");

    // Ensure default rooms
    const { data: r1 } = await supabase.from("rooms").upsert([{ name: "Office" }], { onConflict: "name" }).select();
    const { data: r2 } = await supabase.from("rooms").upsert([{ name: "🌸 Outside" }], { onConflict: "name" }).select();

    let seeded = 0;
    if (seed) {
      const officeId = (r1 && r1[0] && (r1[0] as any).id) || (await supabase.from("rooms").select("id").eq("name", "Office").maybeSingle()).data?.id;
      const outsideId = (r2 && r2[0] && (r2[0] as any).id) || (await supabase.from("rooms").select("id").eq("name", "🌸 Outside").maybeSingle()).data?.id;
      const demo = getDemoPlants();
      const half = Math.ceil(demo.length / 2);
      const officePlants = demo.slice(0, half);
      const outsidePlants = demo.slice(half);
      const toRows = (arr: any[], roomId: any) => arr.map((p) => ({
        room_id: roomId ?? null,
        user_id: 'flora-single-user',
        nickname: p.nickname,
        species_scientific: p.species ?? p.nickname,
        species_common: p.species ?? p.nickname,
      }));
      const rows = [...toRows(officePlants, officeId), ...toRows(outsidePlants, outsideId)];
      if (rows.length) {
        const { data, error } = await supabase.from("plants").insert(rows).select();
        if (error) throw error;
        const inserted = (data as any[]) || [];
        seeded = inserted.length;

        // Set default care plans: Office (7/30), Outside (3/21)
        const officeIds = inserted.filter((p: any) => p.room_id === officeId).map((p: any) => p.id);
        const outsideIds = inserted.filter((p: any) => p.room_id === outsideId).map((p: any) => p.id);
        if (officeIds.length) {
          await supabase
            .from("plants")
            .update({
              care_plan: { water_every: "7 days", fert_every: "30 days" },
              water_every: "7 days",
              fert_every: "30 days",
            })
            .in("id", officeIds);
        }
        if (outsideIds.length) {
          await supabase
            .from("plants")
            .update({
              care_plan: { water_every: "3 days", fert_every: "21 days" },
              water_every: "3 days",
              fert_every: "21 days",
            })
            .in("id", outsideIds);
        }

        // Seed immediate tasks so Today has content
        const today = new Date();
        const toISODate = (d: Date) => d.toISOString().slice(0, 10);
        const dueToday = toISODate(today);
        const dueNextWeek = toISODate(new Date(today.getTime() + 7 * 86400000));
        const taskRows: any[] = [];
        for (const p of inserted) {
          // Water task today for all
          taskRows.push({ plant_id: p.id, type: 'water', due_date: dueToday, user_id: 'flora-single-user' });
          // Fertilize next week (so Forecast shows something)
          taskRows.push({ plant_id: p.id, type: 'fertilize', due_date: dueNextWeek, user_id: 'flora-single-user' });
        }
        if (taskRows.length) {
          await supabase.from("tasks").insert(taskRows);
        }
      }
    }

    return NextResponse.json({ ok: true, seeded });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export const runtime = "nodejs";
