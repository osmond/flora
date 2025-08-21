"use client";

import { useState, useEffect } from "react";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

export default function AddPlantForm() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [commonName, setCommonName] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data.data || []))
      .catch((err) => console.error("Failed to load rooms:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("species", species);
    formData.append("common_name", commonName);
    formData.append("room", room);
    if (photo) {
      formData.append("photo", photo);
    }

    const res = await fetch("/api/plants", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setName("");
      setSpecies("");
      setCommonName("");
      setRoom("");
      setPhoto(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Plant Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <SpeciesAutosuggest
        value={species}
        onSelect={(scientificName: string, common?: string) => {
          setSpecies(scientificName);
          setCommonName(common || "");
        }}
      />

      <div>
        <label className="mb-1 block text-sm font-medium">Room</label>
        <input
          type="text"
          list="room-options"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <datalist id="room-options">
          {rooms.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Common Name</label>
        <input
          type="text"
          value={commonName}
          onChange={(e) => setCommonName(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        Save Plant
      </button>
    </form>
  );
}

