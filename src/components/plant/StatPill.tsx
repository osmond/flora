import type { ReactNode } from "react";

interface StatPillProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-4 text-center">
      <div className="text-xl">{icon}</div>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
