import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PlantRow = {
  id: string;
  nickname: string;
  species?: string | null;
  water_every?: string | null;
  fert_every?: string | null;
  last_watered_at?: string | null;
  last_fertilized_at?: string | null;
};

async function getPlant(id: string): Promise<PlantRow | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, anon);
    const { data, error } = await supabase
      .from("plants")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) return null;
    return data as PlantRow;
  } catch {
    return null;
  }
}

export default async function PlantDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await getPlant(id);
  if (!plant) notFound();

  return (
    <section className="space-y-6 px-4 py-6 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{plant.nickname}</h1>
        <div className="flex gap-2">
          <Button id="log-event" size="sm">
            Log
          </Button>
          <Button size="sm" variant="secondary">
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Care schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Water every: </span>
              <Badge variant="secondary">{plant.water_every ?? "—"}</Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Fertilize every: </span>
              <Badge variant="secondary">{plant.fert_every ?? "—"}</Badge>
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
              {plant.last_watered_at
                ? new Date(plant.last_watered_at).toLocaleDateString()
                : "—"}
            </div>
            <div>
              <span className="text-muted-foreground">Last fertilized: </span>
              {plant.last_fertilized_at
                ? new Date(plant.last_fertilized_at).toLocaleDateString()
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

