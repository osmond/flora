// src/components/TaskList.tsx
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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function playChime() {
  if (typeof window === "undefined") return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AudioCtx();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(660, ctx.currentTime);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 1);
  oscillator.onended = () => ctx.close();
}

export default function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);

  if (!tasks || tasks.length === 0) {
    return <EmptyTasksState />;
  }

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
      playChime();
    } catch {
      setTasks(previous); // toast happens in apiFetch
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
      setTasks(previous); // toast happens in apiFetch
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
  onComplete: (id: string) => Promise<void> | void;
  onSnooze: (id: string, days?: number) => Promise<void> | void;
}) {
  return (
    <Card className="border-muted/40">
      <CardHeader className="flex-row items-center justify-between">
        <h2 className="text-lg font-semibold">{label}</h2>
        <Badge variant="secondary">{items.length}</Badge>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here 🎉</p>
        ) : (
          <motion.ul layout className="space-y-4">
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

type TaskItemProps = {
  task: Task;
  onComplete: (id: string) => Promise<void> | void;
  onSnooze: (id: string, days?: number) => Promise<void> | void;
};

function TaskItem({ task, onComplete, onSnooze }: TaskItemProps) {
  const [startX, setStartX] = useState<number | null>(null);
  const [offsetX, setOffsetX] = useState(0);
  const [pending, setPending] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLLIElement>) => {
    setStartX(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (startX !== null) {
      const delta = e.clientX - startX;
      if (delta > 0) setOffsetX(delta);
    }
  };
  const handlePointerEnd = () => {
    if (offsetX > 100 && !pending) {
      triggerComplete();
    } else {
      setOffsetX(0);
    }
    setStartX(null);
  };

  const triggerComplete = () => {
    if (pending) return;
    setPending(true);
    void onComplete(task.id);
  };

  const handleSnoozeSelect = async (days: number) => {
    if (pending) return;
    setPending(true);
    try {
      await onSnooze(task.id, days);
    } finally {
      setPending(false);
    }
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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerLeave={startX !== null ? handlePointerEnd : undefined}
      onPointerCancel={handlePointerEnd}
    >
      {/* TaskCard already uses your design; keep it */}
      <TaskCard
        task={task}
        onComplete={triggerComplete}
        onSnooze={handleSnoozeSelect}
        pending={pending}
      />
    </motion.li>
  );
}
