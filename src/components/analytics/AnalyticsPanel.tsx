"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui";

const LineChart = dynamic(() => import("@/components/ui/line-chart").then(m => m.LineChart), {
  ssr: false,
});
const BarChart = dynamic(() => import("@/components/ui/bar-chart").then(m => m.BarChart), {
  ssr: false,
});

interface Stats {
  daily: { date: string; count: number }[];
  weekly: { week: string; count: number }[];
}

export default function AnalyticsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-destructive">Failed to load stats.</div>;
  }

  if (!stats) {
    return <div className="text-muted-foreground">Loading analytics...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-2xl border bg-white shadow-card">
        <CardContent>
          <LineChart data={stats.daily} />
        </CardContent>
      </Card>
      <Card className="rounded-2xl border bg-white shadow-card">
        <CardContent>
          <BarChart data={stats.weekly} />
        </CardContent>
      </Card>
    </div>
  );
}

