import TaskList from "@/components/TaskList";
import { generateTasks } from "@/lib/tasks";
import type { Plant } from "@/lib/tasks";
import type { Task } from "@/types/task";
import { isDemoMode } from "@/lib/server-demo";

// NOTE: we lazy-import supabase in the loader so the page still
// renders fine without the package in dev/canvas environments.
async function getTasksFromSupabase(): Promise<Task[] | null> {
  if (await isDemoMode()) return null;
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
  const { data: initialData, error } = await supabase
    .from("tasks_today_view")
    .select("*");
  let data = initialData;

  if (error || !data) {
    const res = await supabase
      .from("tasks")
      .select("id, plant_id, plant_name, type, due_at, status")
      .gte("due_at", new Date(Date.now() - 14 * 86400000).toISOString());
    if (res.error || !res.data) return [];
    data = res.data as any[];
  }

  // Ensure we never pass Promises into JSX
  return (data as any[]).map((row) => {
    const dueISO =
      row?.due_at ?? row?.dueAt ?? row?.due ?? new Date().toISOString();
    return {
      id: String(row.id ?? row.task_id ?? `${row.plant_id}-${row.type}`),
      due: new Date(dueISO).toISOString(),
      type: (row?.type ?? row?.task_type ?? "water") as Task["type"],
      plantName: row?.plant_name ?? row?.nickname ?? "Plant",
      plantId: row?.plant_id ?? undefined,
    } satisfies Task;
  });
}

// --- Fallback sample plants (kept for local/dev) ---
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

export default async function TodayPage() {
  const demo = await isDemoMode();
  let tasks: Task[] = [];
  if (demo) {
    tasks = generateTasks(samplePlants) as Task[];
  } else {
    const dbTasks = await getTasksFromSupabase();
    tasks = (dbTasks ?? []) as Task[];
  }

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <h1 className="text-2xl font-semibold">Today&apos;s Tasks</h1>
      <TaskList tasks={tasks} />
    </section>
  );
}
