"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type PlantInfo = { id: string; name: string };
export type Task = {
  id: string;
  type: string;
  due_date: string;
  plant: PlantInfo[];
};

export default function TaskItem({ task, today }: { task: Task; today: string }) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    });
    // allow animation to play before refreshing
    setTimeout(() => router.refresh(), 300);
  };

  const handleSnooze = async () => {
    const reason = prompt("Why snooze? (optional)")?.trim();
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "snooze", reason: reason || undefined }),
    });
    router.refresh();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    // swipe threshold of 50px
    if (deltaX > 50) {
      handleComplete();
    } else if (deltaX < -50) {
      handleSnooze();
    }
    touchStartX.current = null;
  };

  const plant = task.plant?.[0];

  return (
    <li
      className={`rounded border p-4 transition-all duration-300 ${isCompleting ? "opacity-0 translate-x-full" : ""}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="font-semibold">{task.type}</div>
      {plant && <div className="text-sm text-gray-600">{plant.name}</div>}
      {task.due_date !== today && (
        <div className="text-xs text-gray-500">{task.due_date}</div>
      )}
      <div className="mt-2 flex gap-2 text-sm">
        <button
          onClick={handleComplete}
          className="rounded bg-green-600 px-2 py-1 text-white"
        >
          Done
        </button>
        <button
          onClick={handleSnooze}
          className="rounded bg-gray-300 px-2 py-1"
        >
          Snooze
        </button>
      </div>
    </li>
  );
}

