#!/bin/bash

set -e

echo "📄 Creating src/app/add/page.tsx..."

mkdir -p src/app/add

cat <<EOF > src/app/add/page.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddPlantPage() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [carePlan, setCarePlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/ai-care', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, species }),
    });

    const data = await res.json();
    setCarePlan(data);
    setLoading(false);
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">🌿 Add a Plant</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Plant Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Fernie"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Species</label>
          <input
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. Boston Fern"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Get Care Plan'}
        </button>
      </form>

      {carePlan && (
        <div className="mt-8 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold mb-2">🌱 Suggested Care Plan</h2>
          <p><strong>Water every:</strong> {carePlan.waterEvery}</p>
          <p><strong>Fertilize every:</strong> {carePlan.fertEvery}</p>
          <p><strong>Formula:</strong> {carePlan.fertFormula}</p>
          <p className="mt-2 text-sm text-gray-600">{carePlan.rationale}</p>
        </div>
      )}
    </main>
  );
}
EOF

echo "✅ Add a Plant page created at src/app/add/page.tsx"
