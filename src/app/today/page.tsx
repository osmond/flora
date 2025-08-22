"use client";

import * as React from "react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// lucide-react
import { Check, AlarmClock, CalendarClock } from "lucide-react";

type Task = {
  id: string;
  title: string;
  due: "overdue" | "today" | "upcoming";
  meta?: string; // small status like "3d overdue", "in 2d"
};

// Demo data — replace with your real tasks
const DEMO: Task[] = [
  { id: "1", title: "Water Kay (Monstera)", due: "overdue", meta: "3d overdue" },
  { id: "2", title: "Mist Fern", due: "today", meta: "due today" },
  { id: "3", title: "Fertilize ZZ", due: "upcoming", meta: "in 2d" },
];

export default function TodayPage() {
  const [tab, setTab] = React.useState<"overdue" | "today" | "upcoming">("today");

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 space-y-6 font-inter">
      <header className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
      </header>

      <Tabs value={tab} onValueChange={(v: any) => setTab(v)}>
        <TabsList>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        {(["overdue", "today", "upcoming"] as const).map((key) => (
          <TabsContent value={key} key={key} className="space-y-2 pt-3">
            {DEMO.filter((t) => t.due === key).map((t) => (
              <Card key={t.id} className="rounded-2xl bg-card/95 border border-muted shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  {t.meta && <Badge variant="secondary">{t.meta}</Badge>}
                  <div className="flex-1">{t.title}</div>

                  {/* Accessible swipe alternatives: Done + Snooze */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-xl">
                      <Check className="h-4 w-4 mr-1" />
                      Done
                    </Button>
                    <Button size="sm" variant="secondary" className="rounded-xl">
                      <AlarmClock className="h-4 w-4 mr-1" />
                      Snooze
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {DEMO.filter((t) => t.due === key).length === 0 && (
              <div className="text-sm text-muted-foreground">Nothing here yet.</div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
