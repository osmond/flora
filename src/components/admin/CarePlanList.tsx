"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PlanRow = {
  id: string;
  nickname: string;
  water_every?: string | null;
  fert_every?: string | null;
  care_plan?: { water_every?: string; fert_every?: string } | null;
};

export default function CarePlanList({ plans }: { plans: PlanRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function regen(id: string) {
    if (busyId) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/care-plans/generate/${id}`, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        toast.error(json?.error || "Failed to regenerate plan");
        return;
      }
      toast.success("Care plan updated");
      startTransition(() => router.refresh());
    } catch {
      toast.error("Failed to regenerate plan");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-muted-foreground">
          <tr>
            <th className="py-2 pr-4">Plant</th>
            <th className="py-2 pr-4">Water every</th>
            <th className="py-2 pr-4">Fertilize every</th>
            <th className="py-2 pr-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.slice(0, 50).map((p) => {
            const water = p.water_every ?? p.care_plan?.water_every ?? "—";
            const fert = p.fert_every ?? p.care_plan?.fert_every ?? "—";
            const loading = busyId === p.id || isPending;
            return (
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4 font-medium">{p.nickname}</td>
                <td className="py-2 pr-4">{water}</td>
                <td className="py-2 pr-4">{fert}</td>
                <td className="py-2 pr-4">
                  <Button size="sm" variant="outline" disabled={loading} onClick={() => regen(p.id)}>
                    {loading ? "Updating…" : "Regenerate"}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

