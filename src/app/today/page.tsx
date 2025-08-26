// src/app/today/page.tsx
import TaskList from "@/components/TaskList";
import { generateTasks } from "@/lib/tasks";
import type { Plant } from "@/lib/tasks";
import type { Task } from "@/types/task";
import { createClient } from "@supabase/supabase-js";

// --- Fallback sample plants (your current mock) ---
const samplePlants: Plant[] = [
  {
    id: "1",
    nickname: "Monstera",
    waterEvery: "7 days",
    lastWateredAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "2",
    nickname: "Fiddle Leaf Fig",
    fertEvery: "30 days",
    lastFertilizedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "3",
    nickname: "Snake Plant",
    waterEvery: "14 days",
    lastWateredAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

// Normalize any DB row into your Task shape (at least id + due)
function toTask(row: any): Task {
  // Try a handful of likely column names, then fall back to "today"
  const dueISO =
    row?.due_at ??
    row?.dueAt ??
    row?.due ??
    new Date().toISOString();

  return {
    id: String(row.id ?? row.task_id ?? crypto.randomUUID()),
    // Your TaskList only requires .due; TaskCard can use extras if present:
    due: new Date(dueISO).toISOString(),
    // Optional nice-to-haves if your Task type includes them
    type: row?.type ?? row?.task_type,                // 'water' | 'fertilize'
    plantName: row?.plant_name ?? row?.nickname ?? "", // used by TaskCard if available
    plantId: row?.plant_id ?? undefined,
    status: row?.status ?? undefined,
  } as Task;
}

async function getTasksFromSupabase(): Promise<Task[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const supabase = createClient(url, anon);

  // Prefer a view if you created one that already returns what's due/overdue/upcoming
  let { data, error } = await supabase.from("tasks_today_view").select("*");

  // If the view doesn't exist, fall back to a generic tasks query
  if (error || !data) {
    const res = await supabase
      .from("tasks")
      .select("id, plant_id, plant_name, type, due_at, status")
      .gte("due_at", new Date(Date.now() - 14 * 86400000).toISOString());
    if (res.error || !res.data) return null;
    data = res.data as any[];
  }

  return (data as any[]).map(toTask);
}

export default async function TodayPage() {
  // Try DB first; otherwise compute from sample plants
  const dbTasks = await getTasksFromSupabase();
  const tasks = dbTasks && dbTasks.length > 0 ? dbTasks : generateTasks(samplePlants);

  return (
    <section className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Today&apos;s Tasks</h1>
      <TaskList tasks={tasks} />
    </section>
  );
}
