"use client";

import * as React from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// lucide-react
import { Droplets, Sun, Activity, LineChart } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function StatsPage() {
  const [range, setRange] = React.useState<"week" | "month">("week");
  const data = [
    { day: "Mon", water: 1 },
    { day: "Tue", water: 2 },
    { day: "Wed", water: 0 },
    { day: "Thu", water: 1 },
    { day: "Fri", water: 3 },
    { day: "Sat", water: 1 },
    { day: "Sun", water: 2 },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 space-y-6 font-inter">
      <header className="flex items-center gap-2">
        <LineChart className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Stats</h1>
        <ToggleGroup
          type="single"
          value={range}
          onValueChange={(v: string) => v && setRange(v as "week" | "month")}
          className="ml-auto"
        >
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Droplets className="h-5 w-5 text-primary" />}
          label="Most watered"
          value="Kay"
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-primary" />}
          label="Overdue streak"
          value="3 days"
        />
        <StatCard
          icon={<Sun className="h-5 w-5 text-primary" />}
          label="Avg care interval"
          value="6 days"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border shadow-card">
          <CardHeader>
            <CardTitle>Watering Frequency</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={data}>
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="water" stroke="#5EA897" strokeWidth={2} />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border shadow-card">
          <CardHeader>
            <CardTitle>Weekly Tasks</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={data}>
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="water" stroke="#D3EDE6" strokeWidth={2} />
              </ReLineChart>
            </ResponsiveContainer>
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
    <Card className="rounded-2xl border shadow-card">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/40 bg-primary/10">
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
