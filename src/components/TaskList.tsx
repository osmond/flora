"use client";

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { format, parseISO } from 'date-fns';
import type { Task } from '@/types/task';

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

  const grouped = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const day = format(parseISO(task.due), 'PPP');
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
              <TaskItem
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onSnooze={handleSnooze}
              />
            ))}
          </ul>
        </li>
      ))}
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
        <button
          onClick={triggerComplete}
          className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground focus:ring-2 focus:ring-primary transition-colors duration-200"
        >
          Done
        </button>
        <button
          onClick={() => onSnooze(task.id)}
          className="rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground focus:ring-2 focus:ring-primary transition-colors duration-200"
        >
          Snooze
        </button>
      </div>
    </li>
  );
}

