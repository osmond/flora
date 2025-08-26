import db from "@/lib/db";
import QuickStats from "@/components/plant/QuickStats";
import ScheduleAdjuster from "@/components/plant/ScheduleAdjuster";
import CareCoach from "@/components/plant/CareCoach";
import CareNudge from "@/components/CareNudge";
import PlantTabs from "@/components/plant/PlantTabs";
import WaterPlantButton from "@/components/plant/WaterPlantButton";
import PlantHero from "@/components/plant/PlantHero";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hydrateTimeline } from "@/lib/tasks";
import { getCurrentUserId } from "@/lib/auth";
import type { CareEvent } from "@/types";

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let plant: any = null;
  if (db?.plant) {
    try {
      plant = await db.plant.findFirst({
        where: { id, archived: false },
        include: { room: { select: { name: true } } },
      });
    } catch (err) {
      console.error(err);
    }
  }
  if (!plant) {
    return <div className="p-4 md:p-6 max-w-md mx-auto">Plant not found</div>;
  }

  let heroUrl = plant.imageUrl;
  if (!heroUrl && db?.photo) {
    try {
      const photo = await db.photo.findFirst({
        where: { plantId: plant.id },
        orderBy: { createdAt: "desc" },
        select: { url: true },
      });
      heroUrl = photo?.url ?? null;
    } catch (err) {
      console.error(err);
    }
  }

  const userId = await getCurrentUserId();
  let events: CareEvent[] = [];
  let timelineError = false;
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("id, type, note, image_url, created_at")
      .eq("plant_id", plant.id)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      timelineError = true;
    }
    events = data ?? [];
  } else {
    timelineError = true;
  }

  const timelineEvents = hydrateTimeline(events, {
    id: plant.id,
    waterEvery: plant.waterEvery,
    fertEvery: plant.fertEvery,
  });

  return (
    <div>
      <PlantHero plant={plant} heroUrl={heroUrl} />
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <QuickStats plant={plant} />
        <ScheduleAdjuster plantId={plant.id} waterEvery={plant.waterEvery} />
        <WaterPlantButton plantId={plant.id} />
        <CareNudge plantId={plant.id} />
        <CareCoach plant={plant} />
        <PlantTabs
          plantId={plant.id}
          initialEvents={timelineEvents}
          waterEvery={plant.waterEvery}
          fertEvery={plant.fertEvery}
          timelineError={timelineError}
        />
      </div>
    </div>
  );
}
