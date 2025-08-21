import { createClient } from "@supabase/supabase-js";
import AddNoteForm from "@/components/AddNoteForm";
import AddPhotoForm from "@/components/AddPhotoForm";
import CareTimeline from "@/components/CareTimeline";
import Link from "next/link";
import DeletePhotoButton from "@/components/DeletePhotoButton";
import CareSuggestion from "@/components/CareSuggestion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { getCurrentUserId } from "@/lib/auth";
import type { Event as PlantEvent } from "@/types/event";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "../../../lib/config";

export const revalidate = 0;

function formatWaterAmount(ml: number) {
  const oz = ml / 29.5735;
  return `${oz.toFixed(1)} oz (${ml} mL)`;
}

type CarePlan = {
  waterEvery?: string;
  waterAmountMl?: number;
  fertEvery?: string;
  fertFormula?: string;
  rationale?: string;
  weather?: {
    temperature?: number;
    humidity?: number;
  };
  climateZone?: string;
  confidence?: "low" | "medium" | "high";
};

type Plant = {
  id: string;
  name: string;
  species: string | null;
  common_name: string | null;
  pot_size: string | null;
  pot_material: string | null;
  drainage: string | null;
  soil_type: string | null;
  image_url: string | null;
  indoor: string | null;
  care_plan: CarePlan | null;
};


export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: plant, error: plantError } = await supabase
    .from("plants")
    .select(
      "id, name, species, common_name, pot_size, pot_material, drainage, soil_type, image_url, indoor, care_plan",
    )
    .eq("id", id)
    .eq("user_id", getCurrentUserId())
    .single<Plant>();

  if (plantError || !plant) {
    console.error("Error fetching plant:", plantError?.message);
    return <div>Failed to load plant.</div>;
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, type, note, image_url, public_id, created_at")
    .eq("plant_id", id)
    .order("created_at", { ascending: false });

  const timeline = events as PlantEvent[] | null;
  const notes = timeline?.filter((e) => e.type === "note") || [];
  const photoEvents =
    timeline?.filter((e) => e.type === "photo" && e.image_url) || [];
  const otherEvents =
    timeline?.filter((e) => e.type !== "note" && e.type !== "photo") || [];

  let headerImageUrl = plant.image_url ?? photoEvents[0]?.image_url ?? null;

  if (headerImageUrl) {
    try {
      const res = await fetch(headerImageUrl, { method: "HEAD" });
      if (!res.ok) {
        headerImageUrl = null;
      }
    } catch {
      headerImageUrl = null;
    }
  }

  const lastWaterEvent = otherEvents.find((e) => e.type === "water") || null;
  const lastWatered = lastWaterEvent
    ? new Date(lastWaterEvent.created_at)
    : null;
  let nextWaterDue: Date | null = null;
  if (lastWatered && plant.care_plan?.waterEvery) {
    const match = plant.care_plan.waterEvery.match(/(\d+)/);
    if (match) {
      const days = parseInt(match[1], 10);
      nextWaterDue = new Date(lastWatered);
      nextWaterDue.setDate(nextWaterDue.getDate() + days);
    }
  }

  let careSuggestion: string | null = null;
  if (nextWaterDue && nextWaterDue < new Date()) {
    careSuggestion = `This plant was due for watering on ${nextWaterDue.toLocaleDateString()}. Consider giving it a drink.`;
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        {headerImageUrl ? (
          <div className="relative mb-4">
            <img
              src={headerImageUrl}
              alt={plant.name}
              className="h-48 w-full rounded object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4">
              <h1 className="text-2xl font-bold text-white">{plant.name}</h1>
              {plant.common_name && (
                <p className="text-sm text-white">{plant.common_name}</p>
              )}
              {plant.species && (
                <p className="text-xs italic text-muted-foreground/80">{plant.species}</p>
              )}
            </div>
          </div>
        ) : (
          <h1 className="mb-4 text-2xl font-bold">{plant.name}</h1>
        )}
        {plant.pot_size && (
          <p className="text-sm text-muted-foreground">Pot size: {plant.pot_size}</p>
        )}
        {plant.pot_material && (
          <p className="text-sm text-muted-foreground">
            Pot material: {plant.pot_material}
          </p>
        )}
        {plant.drainage && (
          <p className="text-sm text-muted-foreground">Drainage: {plant.drainage}</p>
        )}
        {plant.soil_type && (
          <p className="text-sm text-muted-foreground">Soil type: {plant.soil_type}</p>
        )}
        {plant.indoor && (
          <p className="text-sm text-muted-foreground">Location: {plant.indoor}</p>
        )}
      </div>

      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Quick Stats</TabsTrigger>
          <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="space-y-4">
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Quick Stats</h2>

              <Button asChild size="sm" variant="secondary">
                <Link href={`/plants/${plant.id}/edit`}>Edit Plant</Link>
              </Button>

            </div>
            {plant.care_plan ? (
              <ul className="space-y-1 text-sm">
                {plant.care_plan.waterEvery && (
                  <li>
                    <span className="font-medium">Water every:</span>{" "}
                    {plant.care_plan.waterEvery}
                    {plant.care_plan.waterAmountMl && (
                      <span className="block text-muted-foreground">
                        {formatWaterAmount(plant.care_plan.waterAmountMl)}
                      </span>
                    )}
                    {lastWatered && (
                      <span className="block text-muted-foreground">
                        Last watered: {lastWatered.toLocaleDateString()}
                        {nextWaterDue &&
                          ` (next due ${nextWaterDue.toLocaleDateString()})`}
                      </span>
                    )}
                  </li>
                )}
                {plant.care_plan.fertEvery && (
                  <li>
                    <span className="font-medium">Fertilize every:</span>{" "}
                    {plant.care_plan.fertEvery}
                    {plant.care_plan.fertFormula && (
                      <span className="block text-muted-foreground">
                        {plant.care_plan.fertFormula}
                      </span>
                    )}
                  </li>
                )}
                {plant.care_plan.confidence && (
                  <li>
                    <span className="font-medium">Confidence:</span>{" "}
                    {plant.care_plan.confidence}
                  </li>
                )}
                <li className="text-xs text-muted-foreground">
                  AI-generated care plan. Consult local experts for critical issues.
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No care plan.</p>
            )}
          </section>
          {careSuggestion && (
            <CareSuggestion plantId={plant.id} suggestion={careSuggestion} />
          )}
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <section className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Photo Gallery</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    Add Photo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Photo</DialogTitle>
                  </DialogHeader>
                  <AddPhotoForm plantId={plant.id} />
                </DialogContent>
              </Dialog>
            </div>
            {photoEvents.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {photoEvents.map((evt) => (
                  <div key={evt.id} className="relative">
                    {evt.image_url && (
                      <img
                        src={evt.image_url}
                        alt={plant.name}
                        className="h-32 w-full rounded object-cover"
                      />
                    )}
                    <DeletePhotoButton eventId={evt.id} />
                    {evt.note && (
                      <div className="text-xs text-muted-foreground">{evt.note}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No photos yet.</p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <section className="space-y-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold">Notes</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    Add Note
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Note</DialogTitle>
                  </DialogHeader>
                  <AddNoteForm plantId={plant.id} />
                </DialogContent>
              </Dialog>
            </div>
            {notes.length > 0 ? (
              <ul className="space-y-2">
                {notes.map((evt) => (
                  <li key={evt.id} className="rounded border p-2">
                    <div className="text-sm text-muted-foreground">
                      {new Date(evt.created_at).toLocaleString()}
                    </div>
                    {evt.note && <div className="text-sm">{evt.note}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notes yet.</p>
            )}
          </section>
        </TabsContent>
      </Tabs>

      <section>
        <h2 className="mb-2 font-semibold">Timeline</h2>
        <CareTimeline events={timeline ?? []} />
        {otherEvents.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {otherEvents.map((evt) => (
              <li key={evt.id} className="rounded border p-2">
                <div className="text-sm text-muted-foreground">
                  {new Date(evt.created_at).toLocaleString()}
                </div>
                <div className="font-medium">{evt.type}</div>
                {evt.note && <div className="text-sm text-muted-foreground">{evt.note}</div>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4">No events logged yet.</p>
        )}
      </section>
    </div>
  );
}
