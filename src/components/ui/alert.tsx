import * as React from "react"
import { cn } from "@/lib/utils"
const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn("rounded-md border border-red-500 bg-red-100 p-4 text-red-700", className)} {...props} />
))
Alert.displayName = "Alert"
export { Alert }
