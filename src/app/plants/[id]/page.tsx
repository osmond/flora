import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlantHero from "@/components/plant/PlantHero";
import PlantTabs from "@/components/plant/PlantTabs";
import ScheduleAdjuster from "@/components/plant/ScheduleAdjuster";
import db from "@/lib/db";
import { supabaseAdmin, SupabaseEnvError } from "@/lib/supabaseAdmin";
import { getFallbackPlant, type PlantRow } from "@/lib/fallbackPlants";
import { isDemoMode } from "@/lib/server-demo";
import { buildDemoEvents, toCareEvents, getDemoPlants } from "@/lib/demoData";

async function getPlant(id: string): Promise<{
  plant: {
    id: string;
    nickname: string;
    speciesScientific?: string | null;
    speciesCommon?: string | null;
    room?: { name: string | null } | null;
  };
  heroUrl: string | null;
}> {
  // Demo mode disabled in live usage; do not fallback
  // 1) Try Prisma (tests mock this path)
  try {
    const prismaPlant = await (db as any)?.plant?.findFirst?.({
      where: { id },
      include: { room: true },
    });
    if (prismaPlant) {
      let heroUrl = prismaPlant.imageUrl ?? null;
      if (!heroUrl) {
        const latest = await (db as any)?.photo?.findFirst?.({
          where: { plantId: id },
          orderBy: { createdAt: "desc" },
        });
        heroUrl = latest?.url ?? null;
      }
      return {
        plant: {
          id: String(prismaPlant.id),
          nickname: prismaPlant.nickname,
          speciesScientific: prismaPlant.speciesScientific ?? null,
          speciesCommon: prismaPlant.speciesCommon ?? null,
          room: prismaPlant.room ?? null,
        },
        heroUrl,
      };
    }
  } catch {}

  // 2) Try Supabase anon
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(url, anon);
      // Try id as string (UUID) first
      let { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      // If not found and looks numeric, try numeric match to support bigint ids
      if ((!data || error) && /^\d+$/.test(id)) {
        const n = Number(id);
        const retry = await supabase
          .from("plants")
          .select("*")
          .eq("id", n)
          .maybeSingle();
        data = retry.data;
        error = retry.error;
      }
      if (!error && data) {
        return {
          plant: {
            id: String((data as any).id),
            nickname: (data as any).nickname,
            speciesScientific: (data as any).species_scientific ?? null,
            speciesCommon: (data as any).species_common ?? null,
            room: (data as any).room ?? null,
          },
          heroUrl: (data as any).image_url ?? null,
        };
      }
    } catch {}
  }
  return { plant: null as any, heroUrl: null };
}

export default async function PlantDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { plant, heroUrl } = await getPlant(id);
  if (!plant) {
    // If a well-formed UUID doesn't exist, show 404
    notFound();
  }

  // Load initial events (admin client for server-side fetch during SSR)
  let initialEvents: any[] = [];
  let timelineError = false;
  {
    try {
      const supabase = supabaseAdmin();
      // Fetch events with flexible id matching
      let { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("plant_id", plant.id)
        .order("created_at", { ascending: false });
      if ((!data || error) && /^\d+$/.test(String(plant.id))) {
        const n = Number(plant.id);
        const retry = await supabase
          .from("events")
          .select("*")
          .eq("plant_id", n)
          .order("created_at", { ascending: false });
        data = retry.data;
        error = retry.error;
      }
      if (error) throw error;
      initialEvents = data ?? [];
    } catch (e) {
      timelineError = true;
    }
  }

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <PlantHero plant={plant} heroUrl={heroUrl} />

      <div className="flex items-center gap-3">
        <Button size="sm">Mark as watered</Button>
        <Button size="sm" variant="secondary">
          Edit
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Care schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Water every: </span>
              <Badge variant="secondary">{(plant as any).water_every ?? (plant as any).care_plan?.water_every ?? "—"}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Fertilize every: </span>
              <Badge variant="secondary">{(plant as any).fert_every ?? (plant as any).care_plan?.fert_every ?? "—"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Last watered: </span>
              {(plant as any).last_watered_at
                ? new Date((plant as any).last_watered_at).toLocaleDateString()
                : "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Last fertilized: </span>
              {(plant as any).last_fertilized_at
                ? new Date((plant as any).last_fertilized_at).toLocaleDateString()
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <ScheduleAdjuster
        plantId={plant.id}
        waterEvery={(plant as any).water_every}
        fertEvery={(plant as any).fert_every}
      />

      {/* Tabs: timeline/photos/notes */}
      <div>
        <PlantTabs
          plantId={plant.id}
          initialEvents={initialEvents as any}
          waterEvery={(plant as any).water_every}
          fertEvery={(plant as any).fert_every}
          timelineError={timelineError}
        />
      </div>
    </section>
  );
}
