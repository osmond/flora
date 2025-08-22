"use client";

import * as React from "react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// lucide-react
import { Check, AlarmClock, CalendarClock, Droplets, Sparkles } from "lucide-react";

type Task = {
  id: string;
  title: string;
  due: "overdue" | "today" | "upcoming";
  meta?: string; // small status like "3d overdue", "in 2d"
  icon: React.ReactNode;
};

// Demo data — replace with your real tasks
const DEMO: Task[] = [
  { id: "1", title: "Water Kay (Monstera)", due: "overdue", meta: "3d overdue", icon: <Droplets className="h-5 w-5" /> },
  { id: "2", title: "Mist Fern", due: "today", meta: "due today", icon: <Droplets className="h-5 w-5" /> },
  { id: "3", title: "Fertilize ZZ", due: "upcoming", meta: "in 2d", icon: <Sparkles className="h-5 w-5" /> },
];

export default function TodayPage() {
  const [tab, setTab] = React.useState<"overdue" | "today" | "upcoming">("today");

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 space-y-6 font-inter">
      <header className="flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
      </header>

      <Tabs value={tab} onValueChange={(v: string) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        {(["overdue", "today", "upcoming"] as const).map((key) => (
          <TabsContent value={key} key={key} className="space-y-2 pt-3">
            {DEMO.filter((t) => t.due === key).map((t) => (
              <Card key={t.id} className="rounded-2xl shadow-card">
                <CardContent className="p-4 flex items-center gap-3">
                  {t.icon}
                  <div className="flex-1">{t.title}</div>
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
              <div className="rounded-2xl border p-8 text-center bg-white shadow-card text-sm text-muted-foreground">
                All caught up
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
