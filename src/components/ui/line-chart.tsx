"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./chart";
import {
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

export interface LineChartProps {
  data: { date: string; count: number }[];
}

export function LineChart({ data }: LineChartProps) {
  const config = {
    count: {
      label: "Tasks",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <ChartContainer config={config} className="h-full">
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line type="monotone" dataKey="count" stroke="var(--color-count)" strokeWidth={2} dot={false} />
      </ReLineChart>
    </ChartContainer>
  );
}

