import { createClient } from "@supabase/supabase-js";
import config from "@/lib/config";

export default async function PlantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.SUPABASE_SERVICE_ROLE_KEY,
  );
  const { data: plant } = await supabase
    .from("plants")
    .select("*")
    .eq("id", id)
    .eq("user_id", "user-123")
    .single();

  let imageUrl = plant?.image_url || null;
  if (!imageUrl) {
    const { data: events } = await supabase
      .from("events")
      .select("image_url, created_at")
      .eq("plant_id", id)
      .order("created_at", { ascending: false });
    imageUrl = events && events[0] ? events[0].image_url : null;
  }

  return (
    <div className="space-y-8">
      <img
        className="w-full h-64 object-cover rounded-lg"
        src={imageUrl ?? "/placeholder.svg"}
        alt={plant?.name ?? "Plant"}
      />

      <div className="grid grid-cols-2 gap-4 text-sm text-muted">
        <div>☀️ Bright indirect light</div>
        <div>💧 Water every 7 days</div>
        <div>🧪 Fertilize monthly</div>
      </div>

      <div className="border-l-2 border-muted space-y-4 pl-4">
        <div className="relative">
          <div className="absolute -left-2 w-4 h-4 bg-primary rounded-full top-1" />
          <div>
            <div className="font-medium text-foreground">Watered</div>
            <div className="text-sm text-muted">Aug 18, 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}
