"use client";

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { isBefore, isSameDay, parseISO, startOfDay } from 'date-fns';
import Link from 'next/link';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';

function playChime() {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AudioCtx();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
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
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      playChime();
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

  const today = startOfDay(new Date());
  const sections: Record<'overdue' | 'due' | 'upcoming', Task[]> = {
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
    <ul className="space-y-8">
      {(
        [
          ['overdue', 'Overdue'],
          ['due', 'Due Today'],
          ['upcoming', 'Upcoming'],
        ] as const
      ).map(([key, label]) =>
        sections[key].length ? (
          <li key={key}>
            <div className="mb-2 text-sm font-medium text-muted-foreground">{label}</div>
            <ul className="space-y-4">
              {sections[key].map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onComplete={handleComplete}
                  onSnooze={handleSnooze}
                />
              ))}
            </ul>
          </li>
        ) : null
      )}
    </ul>
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
  const [removing, setRemoving] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLLIElement>) => {
    setStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (startX !== null) {
      const delta = e.clientX - startX;
      if (delta > 0) setOffsetX(delta);
    }
  };

  const triggerComplete = () => {
    setRemoving(true);
    setTimeout(() => {
      void onComplete(task.id);
    }, 200);
  };

  const handlePointerEnd = () => {
    if (offsetX > 100) {
      triggerComplete();
    }
    setStartX(null);
    setOffsetX(0);
  };

  return (
    <li
      className="rounded-xl border py-4 px-4 sm:px-6 md:px-8 transition-all duration-200"
      style={{
        transform: removing
          ? 'translateX(100%)'
          : `translateX(${offsetX}px)`,
        opacity: removing ? 0 : 1,
        touchAction: 'pan-y',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerLeave={startX !== null ? handlePointerEnd : undefined}
      onPointerCancel={handlePointerEnd}
    >
      <p className="font-medium animate-pulse-weight">{task.plantName}</p>
      <p className="text-sm text-muted-foreground capitalize">{task.type}</p>
      <div className="mt-2 flex gap-3 sm:gap-4 md:gap-6">
        <Button onClick={triggerComplete} className="text-xs">
          Done
        </Button>
        <Button
          onClick={() => onSnooze(task.id)}
          variant="secondary"
          className="text-xs"
        >
          Snooze
        </Button>
        <Button asChild variant="outline" className="text-xs">
          <Link href={`/plants/${task.plantId}`}>View</Link>
        </Button>
      </div>
    </li>
  );
}

