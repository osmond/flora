'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type Species = { scientific: string; common?: string };

interface SpeciesAutosuggestProps {
  value?: Species | null;
  onSelect: (value: Species) => void;
}

export default function SpeciesAutosuggest({ value = null, onSelect }: SpeciesAutosuggestProps) {
  const [query, setQuery] = React.useState(
    value ? value.scientific || value.common || '' : '',
  );
  const [results, setResults] = React.useState<Species[]>([]);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setQuery(value ? value.scientific || value.common || '' : '');
  }, [value]);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/species?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: unknown = await res.json();
          const parsed: Species[] = Array.isArray(data)
            ? (data as unknown[]).map((item) => {
                if (typeof item === 'string') return { scientific: item };
                if (typeof item === 'object' && item) {
                  const obj = item as Record<string, unknown>;
                  const scientific =
                    typeof obj.scientific === 'string'
                      ? obj.scientific
                      : typeof obj.name === 'string'
                      ? obj.name
                      : '';
                  const common =
                    typeof obj.common === 'string' ? obj.common : undefined;
                  return { scientific, common };
                }
                return { scientific: '' };
              })
            : [];
          setResults(parsed);
          setOpen(parsed.length > 0);
        }
      } catch (err) {
        console.error('Species search failed', err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (s: Species) => {
    onSelect(s);
    setQuery(s.common ? `${s.common} (${s.scientific})` : s.scientific);
    setOpen(false);
  };

  return (
    <div className="relative space-y-2">
      <Label htmlFor="species">Species</Label>
      <Input
        id="species"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setOpen(results.length > 0)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        placeholder="Search species..."
      />
      {open && results.length > 0 && (
        <ul
          className="absolute z-10 mt-1 w-full rounded-md border bg-background text-foreground shadow-md"
          role="listbox"
        >
          {results.map((r) => (
            <li
              key={`${r.scientific}-${r.common}`}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(r)}
              role="option"
              aria-selected="false"
            >
              {r.common ? `${r.common} (${r.scientific})` : r.scientific}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
