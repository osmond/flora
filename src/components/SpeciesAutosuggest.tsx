"use client";

import React, { useState, useEffect } from "react";

type Species = {
  id: string;
  common_name: string;
  scientific_name: string;
  image_url?: string;
};

type Props = {
  value: string; // current text (from parent form)
  onSelect: (scientific: string, common?: string) => void; // callback
};

export default function SpeciesAutosuggest({ value, onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    setLoading(true);
    fetch(`/api/species?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setResults(data.data || []))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  function handleSelect(species: Species) {
    setQuery(species.scientific_name); // fill input with chosen species
    setResults([]); // close dropdown
    onSelect(species.scientific_name, species.common_name);
  }

  return (
    <div className="w-full max-w-md relative">
      <label className="block font-medium mb-1">Species</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a plant..."
        className="w-full border rounded px-2 py-1"
      />

      {loading && <p className="text-sm text-gray-500 mt-2">Searching…</p>}

      {results.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
          {results.map((species) => (
            <li
              key={species.id}
              onClick={() => handleSelect(species)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={
                  species.image_url ||
                  "https://placehold.co/48x48?text=🌱"
                }
                alt={species.common_name || species.scientific_name}
                className="w-10 h-10 rounded object-cover bg-gray-100"
              />
              <div>
                <p className="font-medium">{species.common_name || "Unknown"}</p>
                <p className="text-sm text-gray-500 italic">
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
