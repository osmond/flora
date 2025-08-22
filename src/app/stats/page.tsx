"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "@/components/section-title";

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 space-y-6">
      <SectionTitle>Stats</SectionTitle>
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle>Plants</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">12</CardContent></Card>
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle>Tasks done</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">87</CardContent></Card>
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle>Streak</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">5 days</CardContent></Card>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle>Watering cadence</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Chart placeholder</CardContent></Card>
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle>Upcoming workload</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Chart placeholder</CardContent></Card>
      </div>
    </div>
  );
}
