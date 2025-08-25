'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SpeciesAutosuggest, type Species } from '@/components';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AddPlantForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<Species | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Nickname is required');
      return;
    }
    setNameError(null);
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.set('name', name);
    if (species?.scientific || species?.common) {
      formData.set('species', species.scientific || species.common || '');
      if (species.common) {
        formData.set('common_name', species.common);
      }
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
          toast.success('Plant created');
          router.push(`/plants/${id}`);
          return;
        }
        setError('Failed to create plant');
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error || 'Failed to create plant');
      }
    } catch (err) {
      setError('Failed to create plant');
      console.error('Failed to create plant', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-sm text-destructive" aria-live="polite">
            {error}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Nickname</Label>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={nameError ? 'true' : 'false'}
            aria-describedby={nameError ? 'name-error' : undefined}
          />
          {nameError && (
            <p id="name-error" className="text-sm text-destructive">
              {nameError}
            </p>
          )}
        </div>
        <SpeciesAutosuggest value={species} onSelect={setSpecies} />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating...' : 'Create Plant'}
        </Button>
      </form>
    </Card>
  );
}
