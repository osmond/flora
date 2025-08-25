import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-card text-card-foreground shadow-lg", className)} {...props} />
}
function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />
}
export { Card, CardContent }
