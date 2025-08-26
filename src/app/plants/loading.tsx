import PlantCardSkeleton from "@/components/plant/PlantCardSkeleton";

export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <PlantCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

