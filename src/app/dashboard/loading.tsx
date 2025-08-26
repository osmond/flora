import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-8 w-1/3" />
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </section>
        {[...Array(4)].map((_, i) => (
          <section key={i} className="rounded-2xl border p-6">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-24 w-full" />
          </section>
        ))}
      </div>
    </main>
  );
}

