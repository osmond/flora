"use client";

import React, { useState, useEffect } from "react";
import { Input, Label } from "@/components/ui";

type Species = {
  id: string;
  common_name: string;
  scientific_name: string;
  image_url?: string;
};

type Props = {
  value: string; // current text (from parent form)
  onSelect: (scientific: string, common?: string) => void; // callback
  onBlur?: () => void; // notify parent of blur for validation
  showLabel?: boolean; // allow hiding default label when wrapped externally
};

export default function SpeciesAutosuggest({ value, onSelect, onBlur, showLabel = true }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    // Only query the API when the user has entered enough characters
    if (!query || query.length < 3) {
      setResults([]);
      setLoading(false);
      setError(null);
      setNoResults(false);
      return;
    }

    const controller = new AbortController();
    const handler = setTimeout(() => {
      setLoading(true);
      setError(null);
      setNoResults(false);
      fetch(`/api/species?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || data.error) {
            throw new Error(data.error || "Failed to load species suggestions.");
          }
          const species = data.data || [];
          setResults(species);
          setNoResults(species.length === 0);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err);
            if (typeof err.message === "string" && err.message.includes("OPENAI_API_KEY")) {
              setError("Suggestions unavailable: missing OpenAI API key.");
            } else {
              setError("Failed to load species suggestions.");
            }
            setResults([]);
          }
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [query]);

  function handleSelect(species: Species) {
    setQuery(species.scientific_name); // fill input with chosen species
    setResults([]); // close dropdown
    onSelect(species.scientific_name, species.common_name);
  }

  return (
    <div className="relative w-full">
      {showLabel && (
        <Label htmlFor="species" className="mb-1 block text-sm font-medium">
          Species
        </Label>
      )}
      <Input
        id="species"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          onSelect(query);
          onBlur?.();
        }}
        placeholder="Search for a plant..."
      />

      {loading && (
        <p className="mt-2 text-sm text-muted-foreground">Searching…</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error} You can enter a species name manually.
        </p>
      )}

      {noResults && !loading && !error && (
        <p className="mt-2 text-sm text-muted-foreground">
          Suggestions unavailable
        </p>
      )}

      {results.length > 0 && (

        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border bg-popover shadow-lg">

          {results.map((species) => (
              <li
              key={species.id}
              onClick={() => handleSelect(species)}
              className="flex cursor-pointer items-center gap-3 p-2 transition-colors hover:bg-accent"
            >
              <img
                src={
                  species.image_url ||
                  "https://placehold.co/48x48?text=🌱"
                }
                alt={species.common_name || species.scientific_name}
                className="h-10 w-10 rounded bg-muted object-cover"
              />
              <div>
                <p className="font-medium">
                  {species.common_name || "Unknown"}
                </p>
                <p className="italic text-sm text-muted-foreground">
                  {species.scientific_name}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
