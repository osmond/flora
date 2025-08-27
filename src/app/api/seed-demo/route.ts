import { NextResponse } from "next/server";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getDemoPlants, buildDemoEvents } from "@/lib/demoData";

export async function POST() {
  try {
    const supabase = supabaseAdmin();
    // Seed rooms
    const rooms = ["Living Room", "Kitchen", "Bedroom"].map((name) => ({ name }));
    await supabase.from("rooms").insert(rooms).select();

    // Seed plants
    const demo = getDemoPlants();
    const rows = demo.map((p) => ({
      nickname: p.nickname,
      species_common: p.species ?? null,
    }));
    const { data: plants, error } = await supabase.from("plants").insert(rows).select();
    if (error) throw error;

    // Seed events over the last 14 days
    const demoEvents = buildDemoEvents();
    if (plants && plants.length) {
      // Map demo plant ids to inserted ids when possible by nickname
      const idMap = new Map<string, string>();
      for (const p of plants) {
        const match = demo.find((fp) => fp.nickname === (p as any).nickname);
        if (match) idMap.set(match.id, (p as any).id);
      }
      const eventRows = demoEvents.map((e) => ({
        plant_id: idMap.get(e.plant_id) || e.plant_id,
        type: e.type,
        note: e.note,
        image_url: e.image_url,
        created_at: e.created_at,
      }));
      await supabase.from("events").insert(eventRows);

      // Seed simple tasks: some overdue, some due, some completed
      const todayStr = new Date().toISOString().slice(0, 10);
      const taskRows: any[] = [];
      for (const p of plants as any[]) {
        for (let i = 0; i < 5; i++) {
          const day = new Date(); day.setDate(day.getDate() - i);
          const due_date = day.toISOString().slice(0, 10);
          const completed_at = i % 2 === 0 ? new Date(day.getTime() + 12 * 3600000).toISOString() : null;
          taskRows.push({
            plant_id: p.id,
            type: i % 3 === 0 ? 'fertilize' : 'water',
            due_date,
            completed_at,
          });
        }
      }
      await supabase.from("tasks").insert(taskRows);
    }

    return NextResponse.json({ ok: true, inserted: plants?.length ?? 0 });
  } catch (e) {
    if (e instanceof SupabaseEnvError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 503 });
    }
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
