import Image from "next/image";
import db from "@/lib/db";
import QuickStats from "@/components/plant/QuickStats";
import CareCoach from "@/components/plant/CareCoach";
import PlantTabs from "@/components/plant/PlantTabs";
import WaterPlantButton from "@/components/plant/WaterPlantButton";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hydrateTimeline } from "@/lib/tasks";
import { getCurrentUserId } from "@/lib/auth";

export default async function PlantDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const plant = await db.plant.findUnique({
    where: { id: params.id },
    include: { room: { select: { name: true } } },
  });
  if (!plant) {
    return <div className="p-4 md:p-6 max-w-md mx-auto">Plant not found</div>;
  }

  let heroUrl = plant.imageUrl;
  if (!heroUrl) {
    const photo = await db.photo.findFirst({
      where: { plantId: plant.id },
      orderBy: { createdAt: "desc" },
      select: { url: true },
    });
    heroUrl = photo?.url ?? null;
  }

  const userId = await getCurrentUserId();
  const events = supabaseAdmin
    ? (
        await supabaseAdmin
          .from("events")
          .select("id, type, note, image_url, created_at")
          .eq("plant_id", plant.id)
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
      ).data
    : [];

  const timelineEvents = hydrateTimeline(events ?? [], {
    id: plant.id,
    waterEvery: plant.waterEvery,
    fertEvery: plant.fertEvery,
  });

  return (
    <div>
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={plant.name}
          width={800}
          height={400}
          className="h-48 w-full rounded-xl object-cover md:h-64"
        />
      ) : (
        <div className="h-48 w-full rounded-xl bg-muted md:h-64" />
      )}
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{plant.name}</h2>
            {plant.species && (
              <p className="text-sm text-muted-foreground">{plant.species}</p>
            )}
          </div>
          {plant.room?.name && (
            <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium">
              {plant.room.name}
            </span>
          )}
        </div>
        <QuickStats plant={plant} />
        <WaterPlantButton plantId={plant.id} />
        <CareCoach plant={plant} />
        <PlantTabs plantId={plant.id} initialEvents={timelineEvents} />
      </div>
    </div>
  );
}
