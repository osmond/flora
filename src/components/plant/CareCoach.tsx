import { getAiCareSuggestions } from "@/lib/aiCare";

interface Plant {
  id: string;
}

interface CareCoachProps {
  plant: Plant;
}

export default async function CareCoach({ plant }: CareCoachProps) {

  const suggestions = await getAiCareSuggestions(plant.id);

  return (
    <div className="mt-4 rounded border bg-muted/50 p-4">
      <h2 className="mb-2 text-lg font-semibold">Care Coach</h2>
      <ul className="list-disc pl-5 text-sm">
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
