"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/task";

export default function TaskCard({
  task,
  onComplete,
  onSnooze,
  pending = false,
}: {
  task: Task;
  onComplete: () => void;
  onSnooze: (days: number) => void;
  pending?: boolean;
}) {
  const due = task.due ? new Date(task.due) : new Date();
  const icon = (task.type ?? "water") === "water" ? "💧" : "🌱";

  return (
    <Card className="border-muted/40">
      <CardContent className="p-3 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{icon}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium truncate">{task.plantName ?? "Plant"}</div>
              <div className="text-xs text-muted-foreground capitalize">
                {task.type ?? "water"} • {format(due, "MMM d")}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2" aria-busy={pending}>
          <Button size="sm" onClick={onComplete} disabled={pending}>
            Done
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" disabled={pending}>
                Snooze
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[1, 3, 7].map((d) => (
                <DropdownMenuItem key={d} onSelect={() => onSnooze(d)} className="text-xs">
                  Snooze {d}d
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="outline" size="sm">
            <Link href={`/plants/${task.plantId}#log-event`}>Log</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/plants/${task.plantId}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
