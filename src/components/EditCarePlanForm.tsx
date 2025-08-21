"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        <label className="mb-1 block text-sm font-medium">Water every</label>
        <input
          type="text"
          value={waterEvery}
          onChange={(e) => setWaterEvery(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Fertilize every</label>
        <input
          type="text"
          value={fertEvery}
          onChange={(e) => setFertEvery(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Fertilizer formula</label>
        <input
          type="text"
          value={fertFormula}
          onChange={(e) => setFertFormula(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>
      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        Save Care Plan
      </button>
    </form>
  );
}
