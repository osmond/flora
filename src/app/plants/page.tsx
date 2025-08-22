import React from "react";

type Plant = { id: string; name: string; species: string };

const plants: Plant[] = [
  { id: "1", name: "Aloe Vera", species: "Aloe" },
  { id: "2", name: "Monstera", species: "Monstera deliciosa" },
];

export default function PlantsPage() {
  const [view, setView] = React.useState<"grid" | "list">("grid");

  if (plants.length === 0) {
    return (
      <div className="text-center text-muted mt-10">
        <p className="text-lg">No plants yet.</p>
        <p className="text-sm">Add your first one to get started 🌱</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex gap-2">
        <button onClick={() => setView("grid")} className="text-sm underline">
          Grid
        </button>
        <button onClick={() => setView("list")} className="text-sm underline">
          List
        </button>
      </div>

      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((p) => (
            <div key={p.id} className="rounded-lg shadow-card bg-white p-4">
              <img src="/plant.jpg" className="w-full h-32 object-cover rounded-md mb-2" />
              <div className="font-medium text-lg">{p.name}</div>
              <div className="text-sm text-muted">{p.species}</div>
              <span className="bg-secondary text-primary text-xs px-2 py-0.5 rounded-full">
                Needs Water
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {plants.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3 bg-white rounded-md shadow-card">
              <img src="/plant.jpg" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted">Next water: Sunday</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
