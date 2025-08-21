import TaskItem, { Task } from "@/components/TaskItem";
import { getTasks } from "@/lib/data";

export const revalidate = 0;

export default async function TodayPage() {
  const today = new Date().toISOString().slice(0, 10);
  let data;
  try {
    data = await getTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return <div>Failed to load tasks.</div>;
  }

  const tasks = (data ?? []) as Task[];
  const overdue = tasks.filter((t) => t.due_date < today);
  const dueToday = tasks.filter((t) => t.due_date === today);
  const upcoming = tasks.filter((t) => t.due_date > today);

  const renderTasks = (list: Task[]) => (
    <ul className="space-y-4">
      {list.map((task) => (
        <TaskItem key={task.id} task={task} today={today} />
      ))}
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
