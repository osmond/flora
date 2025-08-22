"use client";

import * as React from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// lucide-react
import { Droplets, Sun, Activity, LineChart } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 space-y-6 font-inter">
      <header className="flex items-center gap-2">
        <LineChart className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Droplets className="h-5 w-5 text-primary" />}
          label="Watered this week"
          value="12 times"
        />
        <StatCard
          icon={<Sun className="h-5 w-5 text-primary" />}
          label="Hours of light"
          value="42 hrs"
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-primary" />}
          label="Tasks completed"
          value="18"
        />
      </div>

      {/* Placeholder charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Watering Frequency</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            [ Chart placeholder ]
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card/95 shadow-sm">
          <CardHeader>
            <CardTitle>Light vs. Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            [ Chart placeholder ]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="rounded-2xl border bg-card/95 shadow-sm">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full border bg-accent/40">
          {icon}
        </div>
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="text-lg font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
