import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { getCurrentUserId } from "@/lib/auth";
import DetailView, { type Plant } from "./detail-view";

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  );

  const { data: plantData } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .eq("user_id", getCurrentUserId())
    .single();

  let photoUrl = plantData?.image_url as string | undefined;
  if (!photoUrl) {
    const { data: eventsData } = await supabase
      .from("events")
      .select("image_url")
      .eq("plant_id", id)
      .order("created_at", { ascending: false });
    photoUrl = eventsData?.[0]?.image_url ?? undefined;
  }

  const plant: Plant = {
    id: plantData?.id ?? id,
    name: plantData?.name ?? "",
    species: plantData?.species ?? "",
    room: plantData?.room ?? undefined,
    photoUrl,
    nextWaterAt: null,
    lastWaterAt: null,
    waterEveryDays: null,
    waterAmountMl: null,
    light: (plantData?.light_level ?? undefined) as Plant["light"],
    pot: null,
    humidity: (plantData?.humidity as number | null) ?? null,
  };

  return <DetailView plant={plant} />;
}
