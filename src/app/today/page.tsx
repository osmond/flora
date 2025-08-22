"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionTitle } from "@/components/section-title";

type Task = { id: string; title: string; due: "overdue"|"today"|"upcoming"; meta?: string };

const DEMO: Task[] = [
  { id: "1", title: "Water Kay (Monstera)", due: "overdue", meta: "3d overdue" },
  { id: "2", title: "Mist Fern", due: "today", meta: "due today" },
  { id: "3", title: "Fertilize ZZ", due: "upcoming", meta: "in 2d" },
];

export default function TodayPage() {
  const [tab, setTab] = React.useState<"overdue"|"today"|"upcoming">("today");
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 space-y-6">
      <SectionTitle>Today</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6">
          <div className="text-sm text-muted-foreground">Tasks</div>
          <div className="mt-6 text-3xl font-semibold">3 due today</div>
        </div>
        <div className="rounded-2xl border p-6">
          <div className="text-sm text-muted-foreground">Tasks</div>
          <div className="mt-6 text-3xl font-semibold">1 overdue</div>
        </div>
      </div>
      <Tabs value={tab} onValueChange={(v: "overdue" | "today" | "upcoming") => setTab(v)}>
        <TabsList><TabsTrigger value="overdue">Overdue</TabsTrigger><TabsTrigger value="today">Today</TabsTrigger><TabsTrigger value="upcoming">Upcoming</TabsTrigger></TabsList>
        {(["overdue","today","upcoming"] as const).map(key => (
          <TabsContent value={key} key={key} className="space-y-2 pt-3">
            {DEMO.filter(t=>t.due===key).map(t => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border p-4">
                <div className="text-sm">
                  <div className="text-muted-foreground">{t.meta}</div>
                  <div className="font-medium">{t.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-ring">✓ Done</button>
                  <button className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm focus-visible:ring-2 focus-visible:ring-ring">⏰ Snooze</button>
                </div>
              </div>
            ))}
            {DEMO.filter(t=>t.due===key).length===0 && <div className="text-sm text-muted-foreground">Nothing here yet.</div>}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
