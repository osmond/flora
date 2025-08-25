'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpeciesAutosuggest } from '@/components';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AddPlantForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
          return;
        }
        setError('Failed to create plant');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border bg-card p-4 md:p-6 shadow-sm">
      {error && (
        <p className="text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      <div className="space-y-1">
        <Label htmlFor="name">Nickname</Label>
        <Input
          id="name"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <SpeciesAutosuggest value={species} onSelect={setSpecies} />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Plant'}
      </Button>
    </form>
  );
}
