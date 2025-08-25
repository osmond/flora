'use client';

import * as React from 'react';

export interface SpeciesAutosuggestProps {
  value?: string;
  onSelect: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  showLabel?: boolean;
}

export default function SpeciesAutosuggest({
  value = '',
  onSelect,
  onBlur,
  showLabel = true,
}: SpeciesAutosuggestProps) {
  const [query, setQuery] = React.useState(value);
  const [results, setResults] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setQuery(value);
  }, [value]);

  React.useEffect(() => {
    if (!query) {
      setResults([]);
      setError(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/species?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data: unknown = await res.json();
          const names = Array.isArray(data)
            ? data.map((item: { name: string } | string) =>
                typeof item === 'string' ? item : item.name
              )
            : [];
          setResults(names);
          setError(null);
          setOpen(true);
        } else {
          setError('Failed to load species');
        }
      } catch (err) {
        console.error('Species search failed', err);
        setError('Failed to load species');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (name: string) => {
    onSelect(name);
    setQuery(name);
    setOpen(false);
  };

  return (
    <div className="relative">
      {showLabel && (
        <label className="mb-1 block text-sm font-medium">Species</label>
      )}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={(e) => {
          setTimeout(() => setOpen(false), 100);
          onBlur?.(e);
        }}
        onFocus={() => query && setOpen(results.length > 0)}
        placeholder="Search species..."
        className="h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {error && (
        <p className="mt-1 text-sm text-destructive" aria-live="polite">
          {error}
        </p>
      )}
      {open && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border bg-background text-foreground shadow-md" role="listbox">
          {results.map((r) => (
            <li
              key={r}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(r)}
              role="option"
              aria-selected="false"
            >
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

