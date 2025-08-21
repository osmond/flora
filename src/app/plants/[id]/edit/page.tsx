import { createClient } from "@supabase/supabase-js";
import EditCarePlanForm from "@/components/EditCarePlanForm";
import { getCurrentUserId } from "@/lib/auth";

export const revalidate = 0;

export default async function EditCarePlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: plant, error } = await supabase
    .from("plants")
    .select("id, care_plan")
    .eq("id", id)
    .eq("user_id", getCurrentUserId())
    .single();

  if (error || !plant) {
    console.error("Error fetching plant:", error?.message);
    return <div>Failed to load plant.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Care Plan</h1>
      <EditCarePlanForm plantId={plant.id} initialCarePlan={plant.care_plan} />
    </div>
  );
}
