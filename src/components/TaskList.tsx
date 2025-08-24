"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import type { Task } from '@/types/task';

export default function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  if (!tasks || tasks.length === 0) {
    return <p className="text-sm text-muted-foreground">No tasks for today.</p>;
  }

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' }),
      });
    } catch (err) {
      console.error('Failed to complete task', err);
    } finally {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSnooze = async (id: string, days = 1) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'snooze', days }),
      });
    } catch (err) {
      console.error('Failed to snooze task', err);
    } finally {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

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
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => handleSnooze(task.id)}
                    className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                  >
                    Snooze
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
