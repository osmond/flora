"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

const formSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  species: z.string().min(1, "Species is required"),
  commonName: z.string().optional(),
  room: z.string().optional(),
  potSize: z.string().optional(),
  potMaterial: z.string().optional(),
  drainage: z.string().optional(),
  soilType: z.string().optional(),
  lightLevel: z.string().optional(),
  indoor: z.string().optional(),
  photo: z.any().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  humidity: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddPlantForm() {
  const [rooms, setRooms] = useState<string[]>([]);
  interface CarePlan {
    waterEvery: string;
    fertEvery: string;
    fertFormula: string;
    rationale: string;
    weather?: {
      temperature?: number;
      humidity?: number;
    };
    climateZone?: string;
  }
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [loadingCare, setLoadingCare] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      species: "",
      commonName: "",
      room: "",
      potSize: "",
      potMaterial: "",
      drainage: "",
      soilType: "",
      lightLevel: "",
      indoor: "",
      latitude: "",
      longitude: "",
      humidity: "",
    },
  });

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
        setValue("latitude", latitude.toString());
        setValue("longitude", longitude.toString());
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=relativehumidity_2m`
          );
          const data = await res.json();
          const h = data.current?.relativehumidity_2m;
          if (typeof h === "number") {
            setValue("humidity", h.toString());
          }
        } catch (err) {
          console.error("Failed to fetch humidity:", err);
        }
      },
      (err) => console.error("Geolocation error:", err)
    );
  }, [setValue]);

  const generateCarePlan = async () => {
    try {
      setLoadingCare(true);
      const { latitude, longitude } = getValues();
      const res = await fetch("/api/ai-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
        }),
      });
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

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("species", data.species);
    formData.append("common_name", data.commonName || "");
    formData.append("room", data.room || "");
    formData.append("pot_size", data.potSize || "");
    formData.append("pot_material", data.potMaterial || "");
    formData.append("drainage", data.drainage || "");
    formData.append("soil_type", data.soilType || "");
    formData.append("light_level", data.lightLevel || "");
    formData.append("indoor", data.indoor || "");
    formData.append("latitude", data.latitude || "");
    formData.append("longitude", data.longitude || "");
    formData.append("humidity", data.humidity || "");
    if (carePlan) {
      formData.append("care_plan", JSON.stringify(carePlan));
    } else {
      try {
        const res = await fetch("/api/ai-care", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: data.latitude ? parseFloat(data.latitude) : undefined,
            longitude: data.longitude ? parseFloat(data.longitude) : undefined,
          }),
        });
        if (res.ok) {
          const cp = await res.json();
          formData.append("care_plan", JSON.stringify(cp));
        }
      } catch (err) {
        console.error("Failed to generate care plan:", err);
      }
    }
    if (data.photo && data.photo.length > 0) {
      formData.append("photo", data.photo[0]);
    }

    const res = await fetch("/api/plants", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const { data: responseData } = await res.json();
      reset();
      setCarePlan(null);
      toast.success("Plant saved!");
      const id = responseData?.[0]?.id;
      if (id) {
        router.push(`/plants/${id}`);
      }
    } else {
      toast.error("Failed to save plant");
    }
  };

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const humidity = watch("humidity");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Plant Name</label>
        <input
          type="text"
          {...register("name")}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <SpeciesAutosuggest
        value={watch("species")}
        onSelect={(scientificName: string, common?: string) => {
          setValue("species", scientificName, { shouldValidate: true });
          setValue("commonName", common || "", { shouldValidate: true });
        }}
      />
      {errors.species && (
        <p className="text-sm text-red-600">{errors.species.message}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Room</label>
        <input
          type="text"
          list="room-options"
          {...register("room")}
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
          {...register("commonName")}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Pot Size</label>
          <input
            type="text"
            {...register("potSize")}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Pot Material</label>
          <input
            type="text"
            {...register("potMaterial")}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Drainage Quality</label>
        <select
          {...register("drainage")}
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
          {...register("soilType")}
          className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Location</label>
        <select
          {...register("indoor")}
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
          {...register("lightLevel")}
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
          {...register("photo")}
          className="w-full"
        />
      </div>

      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />
      <input type="hidden" {...register("humidity")} />

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
            {carePlan.weather && (
              <p>
                Current weather: {carePlan.weather.temperature ?? "?"}°C, {" "}
                {carePlan.weather.humidity ?? "?"}% humidity
              </p>
            )}
            <p className="text-gray-600">{carePlan.rationale}</p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:opacity-50"
      >
        Save Plant
      </button>
    </form>
  );
}

