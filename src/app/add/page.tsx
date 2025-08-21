"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

export default function AddPlantForm() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [commonName, setCommonName] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState<string[]>([]);
  const [potSize, setPotSize] = useState("");
  const [potMaterial, setPotMaterial] = useState("");
  const [drainage, setDrainage] = useState("");
  const [soilType, setSoilType] = useState("");
  const [lightLevel, setLightLevel] = useState("");
  const [indoor, setIndoor] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [humidity, setHumidity] = useState("");
  const [carePlan, setCarePlan] = useState<
    | {
        waterEvery: string;
        fertEvery: string;
        fertFormula: string;
        rationale: string;
      }
    | null
  >(null);
  const [loadingCare, setLoadingCare] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data.data || []))
      .catch((err) => console.error("Failed to load rooms:", err));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLatitude(latitude.toString());
        setLongitude(longitude.toString());
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relativehumidity_2m`
          );
          const data = await res.json();
          const h = data.current?.relativehumidity_2m;
          if (typeof h === "number") {
            setHumidity(h.toString());
          }
        } catch (err) {
          console.error("Failed to fetch humidity:", err);
        }
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, []);

  const generateCarePlan = async () => {
    try {
      setLoadingCare(true);
      const res = await fetch("/api/ai-care", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setCarePlan(data);
      }
    } catch (err) {
      console.error("Failed to generate care plan:", err);
    } finally {
      setLoadingCare(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("species", species);
    formData.append("common_name", commonName);
    formData.append("room", room);
    formData.append("pot_size", potSize);
    formData.append("pot_material", potMaterial);
    formData.append("drainage", drainage);
    formData.append("soil_type", soilType);
    formData.append("light_level", lightLevel);
    formData.append("indoor", indoor);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("humidity", humidity);
    if (carePlan) {
      formData.append("care_plan", JSON.stringify(carePlan));
    } else {
      try {
        const res = await fetch("/api/ai-care", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          formData.append("care_plan", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Failed to generate care plan:", err);
      }
    }
    if (photo) {
      formData.append("photo", photo);
    }

    const res = await fetch("/api/plants", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { data } = await res.json();
      setName("");
      setSpecies("");
      setCommonName("");
      setRoom("");
      setPotSize("");
      setPotMaterial("");
      setDrainage("");
      setSoilType("");
      setLightLevel("");
      setIndoor("");
      setPhoto(null);
      setCarePlan(null);
      toast.success("Plant saved!");
      const id = data?.[0]?.id;
      if (id) {
        router.push(`/plants/${id}`);
      }
    } else {
      toast.error("Failed to save plant");
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Pot Size</label>
          <input
            type="text"
            value={potSize}
            onChange={(e) => setPotSize(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Pot Material</label>
          <input
            type="text"
            value={potMaterial}
            onChange={(e) => setPotMaterial(e.target.value)}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Drainage Quality</label>
        <select
          value={drainage}
          onChange={(e) => setDrainage(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Select</option>
          <option value="Poor">Poor</option>
          <option value="Average">Average</option>
          <option value="Good">Good</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Soil Type</label>
        <input
          type="text"
          value={soilType}
          onChange={(e) => setSoilType(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Location</label>
        <select
          value={indoor}
          onChange={(e) => setIndoor(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Select</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Light Level</label>
        <select
          value={lightLevel}
          onChange={(e) => setLightLevel(e.target.value)}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="Bright">Bright</option>
        </select>
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

      {(latitude || longitude || humidity) && (
        <div className="text-sm text-gray-600">
          {latitude && longitude && (
            <p>
              Location: {latitude}, {longitude}
            </p>
          )}
          {humidity && <p>Local humidity: {humidity}%</p>}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={generateCarePlan}
          disabled={loadingCare}
          className="rounded bg-green-100 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200 disabled:opacity-50"
        >
          {loadingCare ? "Generating…" : "Generate Care Plan"}
        </button>
        {carePlan && (
          <div className="mt-2 space-y-1 rounded border p-3 text-sm">
            <p>Water every: {carePlan.waterEvery}</p>
            <p>Fertilize: {carePlan.fertEvery}</p>
            <p>Formula: {carePlan.fertFormula}</p>
            <p className="text-gray-600">{carePlan.rationale}</p>
          </div>
        )}
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

