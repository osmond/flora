import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

type Task = {
  id: string;
  type: string;
  due_date: string;
  plant: { id: string; name: string }[];
};

export default async function TodayPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("tasks")
    .select("id, type, due_date, plant:plants(id, name)")
    .order("due_date");

  if (error) {
    console.error("Error fetching tasks:", error.message);
    return <div>Failed to load tasks.</div>;
  }

  const tasks = (data ?? []) as Task[];
  const overdue = tasks.filter((t) => t.due_date < today);
  const dueToday = tasks.filter((t) => t.due_date === today);
  const upcoming = tasks.filter((t) => t.due_date > today);

  const renderTasks = (list: Task[]) => (
    <ul className="space-y-4">
      {list.map((task) => {
        const plant = task.plant?.[0];
        return (
          <li key={task.id} className="rounded border p-4">
            <div className="font-semibold">{task.type}</div>
            {plant && (
              <div className="text-sm text-gray-600">{plant.name}</div>
            )}
            {task.due_date !== today && (
              <div className="text-xs text-gray-500">{task.due_date}</div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Today&apos;s Tasks</h1>

      {overdue.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Overdue</h2>
          {renderTasks(overdue)}
        </section>
      )}

      {dueToday.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Due Today</h2>
          {renderTasks(dueToday)}
        </section>
      )}

      {upcoming.length > 0 && (
          <section>
            <h2 className="mb-2 text-xl font-semibold">Upcoming</h2>
            {renderTasks(upcoming)}
          </section>
      )}

      {overdue.length === 0 &&
        dueToday.length === 0 &&
        upcoming.length === 0 && <p>No tasks.</p>}
    </div>
  );
}
