"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Button } from "@/components/ui";

export default function EditCarePlanForm({
  plantId,
  initialCarePlan,
}: {
  plantId: string;
  initialCarePlan: {
    waterEvery?: string;
    fertEvery?: string;
    fertFormula?: string;
  } | null;
}) {
  const router = useRouter();
  const [waterEvery, setWaterEvery] = useState(initialCarePlan?.waterEvery || "");
  const [fertEvery, setFertEvery] = useState(initialCarePlan?.fertEvery || "");
  const [fertFormula, setFertFormula] = useState(initialCarePlan?.fertFormula || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/plants/${plantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        care_plan: {
          waterEvery: waterEvery || undefined,
          fertEvery: fertEvery || undefined,
          fertFormula: fertFormula || undefined,
        },
      }),
    });
    router.push(`/plants/${plantId}`);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="water-every" className="mb-1 block text-sm font-medium">
          Water every
        </Label>
        <Input
          id="water-every"
          type="text"
          value={waterEvery}
          onChange={(e) => setWaterEvery(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="fert-every" className="mb-1 block text-sm font-medium">
          Fertilize every
        </Label>
        <Input
          id="fert-every"
          type="text"
          value={fertEvery}
          onChange={(e) => setFertEvery(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="fert-formula" className="mb-1 block text-sm font-medium">
          Fertilizer formula
        </Label>
        <Input
          id="fert-formula"
          type="text"
          value={fertFormula}
          onChange={(e) => setFertFormula(e.target.value)}
        />
      </div>
      <Button type="submit">Save Care Plan</Button>
    </form>
  );
}
