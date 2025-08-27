"use client";

import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type Props = {
  className?: string;
  children: ReactNode;
  title?: string;
  description?: string;
};

export default function ChartContainer({ className, children, title, description }: Props) {
  return (
    <Card className={className}>
      {title ? (
        <div className="px-4 pt-4">
          <h3 className="text-sm font-medium leading-none">{title}</h3>
          {description ? (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      ) : null}
      <div className="p-2 sm:p-4">{children}</div>
    </Card>
  );
}

