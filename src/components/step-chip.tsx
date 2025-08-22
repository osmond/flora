import { cn } from "@/lib/utils";

export function StepChip({
  step,
  label,
  active,
  done,
}: {
  step: number;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm",
        active ? "bg-accent text-accent-foreground" : "bg-background",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 place-items-center rounded-full border text-xs",
          done ? "bg-primary text-primary-foreground border-primary" : "",
        )}
      >
        {done ? "✓" : step}
      </span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}
