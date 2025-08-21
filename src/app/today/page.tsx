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
    .eq("due_date", today)
    .order("due_date");

  if (error) {
    console.error("Error fetching tasks:", error.message);
    return <div>Failed to load tasks.</div>;
  }

  const tasks = (data ?? []) as Task[];

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Today&apos;s Tasks</h1>
      {tasks && tasks.length > 0 ? (
        <ul className="space-y-4">
          {tasks.map((task) => {
            const plant = task.plant?.[0];
            return (
              <li key={task.id} className="rounded border p-4">
                <div className="font-semibold">{task.type}</div>
                {plant && (
                  <div className="text-sm text-gray-600">{plant.name}</div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No tasks due today.</p>
      )}
    </div>
  );
}
