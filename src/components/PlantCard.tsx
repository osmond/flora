"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PlantCardProps = {
  id: string;
  nickname: string;
  species?: string | null;
  lastWateredAt?: string | null;
  lastFertilizedAt?: string | null;
  waterEvery?: string | null; // "7 days"
  fertEvery?: string | null; // "30 days"
};

const DAY = 86_400_000;

function parseEvery(txt?: string | null) {
  if (!txt) return null;
  const m = /(\d+)/.exec(txt);
  return m ? parseInt(m[1], 10) : null;
}

function nextDue(lastISO?: string | null, every?: string | null) {
  const d = lastISO ? new Date(lastISO) : null;
  const n = parseEvery(every);
  if (!n) return null;
  const base = d ? d.getTime() : Date.now();
  return new Date(base + n * DAY);
}

export default function PlantCard(p: PlantCardProps) {
  const waterDue = nextDue(
    p.lastWateredAt ?? undefined,
    p.waterEvery ?? undefined
  );
  const fertDue = nextDue(
    p.lastFertilizedAt ?? undefined,
    p.fertEvery ?? undefined
  );

  return (
    <Link href={`/plants/${p.id}`} prefetch className="block">
      <Card className="transition-all hover:shadow-md">
        <CardContent className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarFallback>🌿</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{p.nickname}</div>
            <div className="truncate text-sm text-muted-foreground">
              {p.species ?? "Plant"}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {waterDue && (
                <Badge variant="secondary">💧 {waterDue.toLocaleDateString()}</Badge>
              )}
              {fertDue && (
                <Badge
                  className={cn("bg-accent text-accent-foreground")}
                  variant="secondary"
                >
                  🌱 {fertDue.toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

