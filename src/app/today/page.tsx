"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, AlarmClock, CalendarClock, ChevronRight } from "lucide-react";

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
      <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
      <Tabs value={tab} onValueChange={(v:any)=>setTab(v)}>
        <TabsList><TabsTrigger value="overdue">Overdue</TabsTrigger><TabsTrigger value="today">Today</TabsTrigger><TabsTrigger value="upcoming">Upcoming</TabsTrigger></TabsList>
        {(["overdue","today","upcoming"] as const).map(key => (
          <TabsContent value={key} key={key} className="space-y-2 pt-3">
            {DEMO.filter(t=>t.due===key).map(t => (
              <Card key={t.id} className="rounded-2xl">
                <CardContent className="p-4 flex items-center gap-3">
                  <Badge variant="secondary">{t.meta}</Badge>
                  <div className="flex-1">{t.title}</div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="rounded-xl"><Check className="h-4 w-4 mr-1" />Done</Button>
                    <Button size="sm" variant="secondary" className="rounded-xl"><AlarmClock className="h-4 w-4 mr-1" />AlarmClock</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {DEMO.filter(t=>t.due===key).length===0 && <div className="text-sm text-muted-foreground">Nothing here yet.</div>}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
