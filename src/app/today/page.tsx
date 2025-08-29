import TaskList from "@/components/TaskList";
import EmptyState from "@/components/EmptyState";
import { generateTasks } from "@/lib/tasks";
import type { Plant } from "@/lib/tasks";
import type { Task } from "@/types/task";

// NOTE: we lazy-import supabase in the loader so the page still
// renders fine without the package in dev/canvas environments.
async function getTasksFromSupabase(): Promise<Task[] | null> {
  // Live data only; no demo fallback
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];

  let createClient: any;
  try {
    const mod = await import("@supabase/supabase-js");
    createClient = mod.createClient;
  } catch {
    return null; // package not present / edge preview → fallback
  }
  const supabase = createClient(url, anon);

  // Prefer a view if present
  let data: any[] | null = null;
  try {
    const view = await supabase.from("tasks_today_view").select("*");
    if (!view.error && view.data) data = view.data as any[];
  } catch {}

  if (!data) {
    const res = await supabase
      .from("tasks")
      .select("id, plant_id, type, due_date, completed_at")
      .gte("due_date", new Date(Date.now() - 14 * 86400000).toISOString());
    if (res.error || !res.data) return [];
    data = res.data as any[];
  }

  // Ensure we never pass Promises into JSX
  return (data as any[]).map((row) => {
    const dueISO =
      row?.due_at ?? row?.dueAt ?? row?.due ?? row?.due_date ?? new Date().toISOString();
    return {
      id: String(row.id ?? row.task_id ?? `${row.plant_id}-${row.type}`),
      due: new Date(dueISO).toISOString(),
      type: (row?.type ?? row?.task_type ?? "water") as Task["type"],
      plantName: row?.plant_name ?? row?.nickname ?? "Plant",
      plantId: row?.plant_id ?? undefined,
    } satisfies Task;
  });
}

// No demo/sample fallback in live mode

export default async function TodayPage() {
  // Load tasks from DB only
  const dbTasks = await getTasksFromSupabase();
  const tasks = (dbTasks ?? []) as Task[];
  // Also load plant count to decide empty state
  let plantCount = 0;
  try {
    const { supabaseServer } = await import("@/lib/supabase/server");
    const supabase = supabaseServer();
    const { count } = await supabase.from("plants").select("id", { count: "exact", head: true });
    plantCount = count ?? 0;
  } catch {}

  // If there are no plants at all, show a friendly welcome/CTA instead of "All caught up".
  if (!plantCount) {
    return (
      <section className="space-y-6 px-4 py-6 md:px-6">
        <h1 className="text-2xl font-semibold">Today&apos;s Tasks</h1>
        <EmptyState
          title="No plants yet"
          description="Add your first plant to start seeing care tasks here."
          ctaHref="/plants/new"
          ctaLabel="Add a Plant"
        />
      </section>
    );
  }

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <h1 className="text-2xl font-semibold">Today&apos;s Tasks</h1>
      <TaskList tasks={tasks} />
    </section>
  );
}
