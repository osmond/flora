import { getAiCareSuggestions } from "@/lib/aiCare";

interface Plant {
  id: string;
}

interface CareCoachProps {
  plant: Plant;
}

export default async function CareCoach({ plant }: CareCoachProps) {
  let suggestions: string[] = [];
  let error = false;
  try {
    suggestions = await getAiCareSuggestions(plant.id);
  } catch {
    error = true;
  }

  return (
    <div className="mt-4 rounded border bg-muted/50 p-4">
      <h2 className="mb-2 text-lg font-semibold">Care Coach</h2>
      {error ? (
        <p className="text-sm text-destructive">Failed to load suggestions.</p>
      ) : (
        <ul className="list-disc pl-5 text-sm">
          {suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
