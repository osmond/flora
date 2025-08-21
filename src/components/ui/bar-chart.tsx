"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./chart";
import {
  BarChart as ReBarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export interface BarChartProps {
  data: { week: string; count: number }[];
}

export function BarChart({ data }: BarChartProps) {
  const config = {
    count: {
      label: "Tasks",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
      </ReBarChart>
    </ChartContainer>
  );
}

