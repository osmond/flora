'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpeciesAutosuggest } from '@/components';

export default function NewPlantPage() {
  const router = useRouter();
  const [species, setSpecies] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="name">
          Nickname
        </label>
        <input
          id="name"
          name="name"
          required
          className="h-11 w-full rounded-xl border px-3 py-2 text-sm"
        />
      </div>
      <SpeciesAutosuggest value={species} onSelect={setSpecies} />
      <button
        type="submit"
        className="rounded bg-primary px-4 py-2 text-primary-foreground"
      >
        Add Plant
      </button>
    </form>
  );
}

