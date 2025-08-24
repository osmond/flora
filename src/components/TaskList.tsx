"use client";

import { format } from 'date-fns';
import type { Task } from '@/types/task';

export default function TaskList({ tasks }: { tasks: Task[] }) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks for today.</p>;
  }

  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const day = format(new Date(task.due), 'PPP');
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});

  return (
    <ul className="space-y-8">
      {Object.entries(grouped).map(([day, dayTasks]) => (
        <li key={day}>
          <div className="mb-2 text-sm font-medium text-muted-foreground">{day}</div>
          <ul className="space-y-4">
            {dayTasks.map((task) => (
              <li key={task.id} className="rounded-md border p-4">
                <p className="font-medium">{task.plantName}</p>
                <p className="text-sm text-muted-foreground capitalize">{task.type}</p>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
