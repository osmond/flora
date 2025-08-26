"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import type { Task } from "@/types/task"

interface TaskCardProps {
  task: Task
  onComplete: () => void
  onSnooze: (days: number) => void
  pending?: boolean
}

export default function TaskCard({
  task,
  onComplete,
  onSnooze,
  pending = false,
}: TaskCardProps) {
  return (
    <Card className="flex items-center gap-3 px-3 py-3">
      <Avatar>
        <AvatarFallback>🌱</AvatarFallback>
      </Avatar>
      <CardContent className="flex-1 min-w-0 p-0">
        <div className="text-sm font-medium">{task.plantName}</div>
        <div className="text-xs text-muted-foreground capitalize">{task.type}</div>
      </CardContent>
      <div className="flex items-center gap-2">
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
            {[1, 3, 7].map((days) => (
              <DropdownMenuItem
                key={days}
                onSelect={() => onSnooze(days)}
                className="text-xs"
              >
                Snooze {days}d
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
    </Card>
  )
}
