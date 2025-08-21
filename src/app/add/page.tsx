"use client";

import { useState } from "react";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

export default function AddPlantForm() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [commonName, setCommonName] = useState(""); // 👈
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("species", species);
    formData.append("common_name", commonName);
    if (imageFile) formData.append("image", imageFile);

    const res = await fetch("/api/plants", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setName("");
      setSpecies("");
      setCommonName("");
      setImageFile(null);
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
          onSelect={(scientificName: string, common?: string) => {
            setSpecies(scientificName);
            setCommonName(common || ""); // 👈 auto-fill
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

      <div>
        <label>Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>

      <button type="submit">Save Plant</button>
    </form>
  );
}
