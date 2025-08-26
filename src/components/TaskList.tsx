"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  addDays,
  formatISO,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from "date-fns";
import type { Task } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import EmptyTasksState from "@/components/EmptyTasksState";
import { apiFetch } from "@/lib/api";

// shadcn/ui
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  if (!tasks || tasks.length === 0) return <EmptyTasksState />;

  const handleComplete = async (id: string) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await apiFetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      setTasks(previous); // toast handled in apiFetch
    }
  };

  const handleSnooze = async (id: string, days = 1) => {
    const previous = tasks;
    const updated = previous
      .map((t) =>
        t.id === id
          ? { ...t, due: formatISO(addDays(parseISO(t.due), days)) }
          : t
      )
      .sort((a, b) => a.due.localeCompare(b.due));
    setTasks(updated);
    try {
      await apiFetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "snooze", days }),
      });
    } catch {
      setTasks(previous);
    }
  };

  const today = startOfDay(new Date());
  const sections: Record<"overdue" | "due" | "upcoming", Task[]> = {
    overdue: [],
    due: [],
    upcoming: [],
  };
  for (const task of tasks) {
    const due = parseISO(task.due);
    if (isBefore(due, today)) sections.overdue.push(task);
    else if (isSameDay(due, today)) sections.due.push(task);
    else sections.upcoming.push(task);
  }

  return (
    <LayoutGroup>
      <div className="space-y-6">
        <TaskSection
          label="Overdue"
          items={sections.overdue}
          onComplete={handleComplete}
          onSnooze={handleSnooze}
        />
        <TaskSection
          label="Due Today"
          items={sections.due}
          onComplete={handleComplete}
          onSnooze={handleSnooze}
        />
        <TaskSection
          label="Upcoming"
          items={sections.upcoming}
          onComplete={handleComplete}
          onSnooze={handleSnooze}
        />
      </div>
    </LayoutGroup>
  );
}

function TaskSection({
  label,
  items,
  onComplete,
  onSnooze,
}: {
  label: string;
  items: Task[];
  onComplete: (id: string) => void | Promise<void>;
  onSnooze: (id: string, days?: number) => void | Promise<void>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{label}</CardTitle>
        <Badge variant="secondary">{items.length}</Badge>
      </CardHeader>
      <CardContent className="pt-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here 🎉</p>
        ) : (
          <motion.ul layout className="list-none space-y-4 pl-0">
            <AnimatePresence>
              {items.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={onComplete}
                  onSnooze={onSnooze}
                />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </CardContent>
    </Card>
  );
}

function TaskItem({
  task,
  onComplete,
  onSnooze,
}: {
  task: Task;
  onComplete: (id: string) => void | Promise<void>;
  onSnooze: (id: string, days?: number) => void | Promise<void>;
}) {
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [pending, setPending] = useState(false);

  const complete = () => {
    if (pending) return;
    setPending(true);
    void onComplete(task.id);
  };

  return (
    <motion.li
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.2 }}
      style={{ transform: `translateX(${offsetX}px)`, touchAction: "pan-y" }}
      onPointerDown={(e) => setStartX(e.clientX)}
      onPointerMove={(e) => {
        if (startX !== null) {
          const delta = e.clientX - startX;
          if (delta > 0) setOffsetX(delta);
        }
      }}
      onPointerUp={() => {
        if (offsetX > 100 && !pending) complete();
        else setOffsetX(0);
        setStartX(null);
      }}
      onPointerLeave={
        startX !== null
          ? () => {
              if (offsetX > 100 && !pending) complete();
              else setOffsetX(0);
              setStartX(null);
            }
          : undefined
      }
      onPointerCancel={() => {
        setOffsetX(0);
        setStartX(null);
      }}
    >
      <TaskCard
        task={task}
        onComplete={complete}
        onSnooze={async (days = 1) => {
          if (pending) return;
          setPending(true);
          try {
            await onSnooze(task.id, days);
          } finally {
            setPending(false);
          }
        }}
        pending={pending}
      />
    </motion.li>
  );
}

