'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpeciesAutosuggest } from '@/components';

export default function NewPlantPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [preview, setPreview] = useState(false);

  async function createPlant() {
    const formData = new FormData();
    formData.set('name', name);
    if (species) {
      formData.set('species', species);
    }
    try {
      const res = await fetch('/api/plants', {
        method: 'POST',
        body: formData,
        headers: {
          'x-user-id': 'demo-user',
        },
      });
      if (res.ok) {
        const data = await res.json();
        const id = Array.isArray(data) ? data[0]?.id : data?.id;
        if (id) {
          router.push(`/plants/${id}`);
        }
      }
    } catch (err) {
      console.error('Failed to create plant', err);
    }
  }

  if (preview) {
    return (
      <div className="max-w-md space-y-4 p-4 md:p-6 mx-auto">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="rounded-lg border p-4 transition-all">
          <p className="text-sm text-muted-foreground">Nickname</p>
          <p className="font-medium">{name}</p>
          {species && (
            <p className="mt-2 text-sm text-muted-foreground">{species}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(false)}
            className="rounded bg-secondary px-4 py-2 text-sm text-secondary-foreground"
          >
            Edit
          </button>
          <button
            onClick={createPlant}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            Create Plant
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setPreview(true);
      }}
      className="space-y-4 p-4 md:p-6 max-w-md mx-auto"
    >
      <div className="space-y-1">
        <label className="block text-sm font-medium" htmlFor="name">
          Nickname
        </label>
        <input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 w-full rounded-xl border px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none"
        />
      </div>
      <SpeciesAutosuggest value={species} onSelect={setSpecies} />
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Preview
      </button>
    </form>
  );
}

