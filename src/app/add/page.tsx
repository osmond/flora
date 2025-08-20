"use client";

import { useState } from "react";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

export default function AddPlantForm() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [commonName, setCommonName] = useState(""); // 👈

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/plants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, species, commonName }),
    });

    if (res.ok) {
      setName("");
      setSpecies("");
      setCommonName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Plant Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Species</label>
        <SpeciesAutosuggest
          value={species}
          onChange={setSpecies}
          onSelect={(scientificName: string, common: string) => {
            setSpecies(scientificName);
            setCommonName(common); // 👈 auto-fill
          }}
        />
      </div>

      <div>
        <label>Common Name</label>
        <input
          type="text"
          value={commonName}
          onChange={(e) => setCommonName(e.target.value)} // 👈 editable override
        />
      </div>

      <button type="submit">Save Plant</button>
    </form>
  );
}
