"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

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
      <div className="rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:shadow-sm motion-reduce:hover:translate-y-0">
        <LineChart data={stats.daily} />
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:shadow-sm motion-reduce:hover:translate-y-0">
        <BarChart data={stats.weekly} />
      </div>
    </div>
  );
}

