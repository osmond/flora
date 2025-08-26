import { Skeleton } from "@/components/ui/skeleton";

export default function PlantCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="h-40 w-full" />
      <div className="p-2 space-y-2">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

