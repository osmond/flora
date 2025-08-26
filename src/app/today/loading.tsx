import { Skeleton } from "@/components/ui/skeleton"
import TaskSkeleton from "@/components/TaskSkeleton"

export default function Loading() {
  return (
    <section className="p-4 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      {[...Array(3)].map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </section>
  )
}
