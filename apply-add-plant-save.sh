#!/bin/bash
set -e

echo "📦 Creating server-side Supabase admin client..."
mkdir -p src/lib
cat > src/lib/supabaseAdmin.ts <<'EOF'
import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);
EOF

echo "🛣️  Adding POST /api/plants route..."
mkdir -p src/app/api/plants
cat > src/app/api/plants/route.ts <<'EOF'
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Expect: { name, species, carePlan: { waterEvery, fertEvery, fertFormula } }
    const { name, species, carePlan } = body ?? {};
    if (!name || !species || !carePlan) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('plants')
      .insert({
        name,
        species,
        water_every: carePlan.waterEvery,
        fert_every: carePlan.fertEvery,
        fert_formula: carePlan.fertFormula,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, plant: data }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
EOF

echo "🧾 Updating /add page with a Save button..."
ADD_PAGE="src/app/add/page.tsx"
if [ ! -f "$ADD_PAGE" ]; then
  echo "❌ $ADD_PAGE not found. Create the /add page first."
  exit 1
fi

# Replace existing page with a version that has a "Save" button after AI plan
cat > "$ADD_PAGE" <<'EOF'
'use client';

import { useState } from 'react';

type CarePlan = {
  waterEvery: string;
  fertEvery: string;
  fertFormula: string;
  rationale?: string;
};

export default function AddPlantPage() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSavedMsg(null);

    const res = await fetch('/api/ai-care', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, species }),
    });

    if (!res.ok) {
      setErrorMsg('AI care suggestion failed.');
      setLoading(false);
      return;
    }

    const data = await res.json();
    setCarePlan(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!carePlan) return;
    setSaving(true);
    setErrorMsg(null);
    setSavedMsg(null);

    const res = await fetch('/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, species, carePlan }),
    });

    const out = await res.json();
    if (!res.ok) {
      setErrorMsg(out?.error ?? 'Save failed');
      setSaving(false);
      return;
    }

    setSaving(false);
    setSavedMsg('Saved! ✅');
    // TODO: navigate to /plants/[id] once we add that route
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

      {errorMsg && <p className="mt-4 text-red-700">{errorMsg}</p>}
      {savedMsg && <p className="mt-4 text-green-700">{savedMsg}</p>}

      {carePlan && (
        <div className="mt-8 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold mb-2">🌱 Suggested Care Plan</h2>
          <p><strong>Water every:</strong> {carePlan.waterEvery}</p>
          <p><strong>Fertilize every:</strong> {carePlan.fertEvery}</p>
          <p><strong>Formula:</strong> {carePlan.fertFormula}</p>
          {carePlan.rationale && <p className="mt-2 text-sm text-gray-600">{carePlan.rationale}</p>}

          <button
            onClick={handleSave}
            className="mt-4 bg-black text-white px-4 py-2 rounded disabled:opacity-60"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Plant'}
          </button>
        </div>
      )}
    </main>
  );
}
EOF

echo "✅ /add page can now save to Supabase."
echo "🔚 Done."
