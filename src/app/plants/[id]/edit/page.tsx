import { createClient } from "@supabase/supabase-js";
import EditPlantForm from "@/components/EditPlantForm";
import { getCurrentUserId } from "@/lib/auth";
import {
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "../../../../lib/config";

export const revalidate = 0;

export default async function EditPlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: plant, error } = await supabase
    .from("plants")
    .select(
      "id, name, species, common_name, room, pot_size, pot_material, drainage, soil_type, light_level, indoor, care_plan",
    )
    .eq("id", id)
    .eq("user_id", getCurrentUserId())
    .single();

  if (error || !plant) {
    console.error("Error fetching plant:", error?.message);
    return <div>Failed to load plant.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Plant</h1>
        <EditPlantForm plant={plant} />
      </div>
    </div>
  );
}
