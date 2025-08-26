import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface DashboardStatProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function DashboardStat({ title, value, subtitle }: DashboardStatProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold">{value}</div>
        {subtitle ? (
          <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
        ) : null}
      </CardContent>
    </Card>
  );
}
