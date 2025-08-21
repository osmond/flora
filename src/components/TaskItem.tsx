"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { toast } from "@/components/ui/sonner";
import { Check, Clock } from "lucide-react";
import SnoozeDialog from "./SnoozeDialog";

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
  const [snoozeOpen, setSnoozeOpen] = useState(false);

  const handleComplete = async () => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      if (res.ok) {
        setIsCompleting(true);
        // allow animation to play before refreshing
        setTimeout(() => router.refresh(), 200);
      } else {
        toast("Failed to complete task");
      }
    } catch {
      toast("Failed to complete task");
    }
  };

  const handleSnooze = async ({ days, reason }: { days: number; reason?: string }) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "snooze", days, reason }),
      });
      if (res.ok) {
        toast("Task snoozed");
        router.refresh();
      } else {
        toast("Failed to snooze task");
      }
    } catch {
      toast("Failed to snooze task");
    }
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
      setSnoozeOpen(true);
    }
    touchStartX.current = null;
  };

  const plant = task.plant?.[0];

  return (
    <li>
      <SnoozeDialog
        open={snoozeOpen}
        onOpenChange={setSnoozeOpen}
        onConfirm={handleSnooze}
      />
      <Card
        className={`p-4 transition-all duration-200 ease-out motion-reduce:transition-none hover:shadow-md hover:translate-y-[-1px] ${
          isCompleting ? "opacity-0 translate-x-full shadow-md translate-y-[-1px]" : ""
        }`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Badge variant="outline" className="mb-1">
          {task.type}
        </Badge>
        {plant && <div className="text-sm text-muted-foreground">{plant.name}</div>}
        {task.due_date !== today && (
          <div className="text-xs text-muted-foreground">{task.due_date}</div>
        )}
        <div className="mt-4 flex gap-3 text-sm">
          <Button onClick={handleComplete}>
            <Check className="mr-1 h-4 w-4" strokeWidth={1.5} />
            Done
          </Button>
          <Button variant="secondary" onClick={() => setSnoozeOpen(true)}>
            <Clock className="mr-1 h-4 w-4" strokeWidth={1.5} />
            Snooze
          </Button>
        </div>
      </Card>
    </li>
  );
}

