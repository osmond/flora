import * as React from "react"
import { cn } from "@/lib/utils"
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
}
const Tabs: React.FC<TabsProps> = ({ tabs, active, onChange, className }) => {
  return (
    <div className={cn("flex gap-4 border-b", className)}>
      {tabs.map((tab) => (
        <button key={tab} onClick={() => onChange(tab)} className={cn("py-2 px-4", { "border-b-2 border-primary": tab === active })}>
          {tab}
        </button>
      ))}
    </div>
  )
}
export { Tabs }
