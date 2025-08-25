'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpeciesAutosuggest } from '@/components';
import { Button } from '@/components/ui/button';

export default function NewPlantPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createPlant() {
    setLoading(true);
    setError(null);
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
      } else {
        setError('Failed to create plant');
      }
    } catch (err) {
      setError('Failed to create plant');
      console.error('Failed to create plant', err);
    } finally {
      setLoading(false);
    }
  }

  if (preview) {
    return (
      <div className="max-w-md p-4 md:p-6 mx-auto">
        <div className="space-y-6 rounded-xl border bg-card p-4 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Preview</h2>
          {error && (
            <p className="text-sm text-destructive" aria-live="polite">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Nickname</p>
            <p className="font-medium">{name}</p>
            {species && (
              <p className="text-sm text-muted-foreground">{species}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setPreview(false);
                setError(null);
              }}
              disabled={loading}
            >
              Edit
            </Button>
            <Button
              type="button"
              onClick={createPlant}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Plant'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md p-4 md:p-6 mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPreview(true);
        }}
        className="space-y-6 rounded-xl border bg-card p-4 md:p-6 shadow-sm"
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
            className="h-11 w-full rounded-lg border px-3 text-sm transition-colors focus:border-primary focus:outline-none"
          />
        </div>
        <SpeciesAutosuggest value={species} onSelect={setSpecies} />
        <Button type="submit">Preview</Button>
      </form>
    </div>
  );
}

