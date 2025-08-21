"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

const formSchema = z.object({
  name: z.string().min(1, "Plant name is required"),
  species: z.string().min(1, "Species is required"),
  commonName: z.string().optional(),
  room: z.string().optional(),
  potSize: z
    .number({ invalid_type_error: "Pot size must be a number" })
    .min(1, "Pot size must be at least 1")
    .max(100, "Pot size cannot exceed 100")
    .optional(),
  potUnit: z.enum(["cm", "in"]).optional(),
  potMaterial: z.string().optional(),
  potMaterialOther: z.string().optional(),
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
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      name: "",
      species: "",
      commonName: "",
      room: "",
      potSize: undefined,
      potUnit: "cm",
      potMaterial: "",
      potMaterialOther: "",
      drainage: "",
      soilType: "",
      lightLevel: "",
      indoor: "",
      latitude: "",
      longitude: "",
      humidity: "",
    },
  });

  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));


  const photoFile = watch("photo");
  const selectedPotMaterial = watch("potMaterial");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  useEffect(() => {
    if (photoFile && photoFile.length > 0) {
      const file = photoFile[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPhotoPreview(null);
  }, [photoFile]);

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
    formData.append(
      "pot_size",
      data.potSize !== undefined
        ? `${data.potSize}${data.potUnit ? ` ${data.potUnit}` : ""}`
        : ""
    );
    const potMaterial =
      data.potMaterial === "Other" ? data.potMaterialOther : data.potMaterial;
    formData.append("pot_material", potMaterial || "");
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
      toast("Plant saved!");
      const id = responseData?.[0]?.id;
      if (id) {
        router.push(`/plants/${id}`);
      }
    } else {
      toast("Failed to save plant");
    }
  };

  const latitude = watch("latitude");
  const longitude = watch("longitude");
  const humidity = watch("humidity");
  const nameValue = watch("name");
  const speciesValue = watch("species");

  const canProceed = () => {
    if (step === 1) return !!nameValue && !!speciesValue;
    if (step === 5) return !!carePlan;
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${i < step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Step {step} of {totalSteps}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Identify</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Nickname</label>
            <input
              type="text"
              {...register("name")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <SpeciesAutosuggest
              value={speciesValue}
              onSelect={(scientific: string, common?: string) => {
                setValue("species", scientific, { shouldValidate: true });
                setValue("commonName", common || "", { shouldValidate: true });
              }}
            />
            {errors.species && (
              <p className="text-sm text-red-600">{errors.species.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Photo</label>
            <input
              type="file"
              accept="image/*"
              {...register("photo")}
              className="w-full"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 h-32 w-32 rounded object-cover"
              />
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Place</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Room</label>
            <input
              type="text"
              list="room-options"
              {...register("room")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <datalist id="room-options">
              {rooms.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Location</label>
            <select
              {...register("indoor")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select</option>
              <option value="Indoor">🏠 Indoor</option>
              <option value="Outdoor">🌳 Outdoor</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Light Level</label>
            <select
              {...register("lightLevel")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select</option>
              <option value="Low">☁️ Low</option>
              <option value="Medium">⛅ Medium</option>
              <option value="Bright">☀️ Bright</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Pot Setup</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Pot Size</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  step={1}
                  {...register("potSize", { valueAsNumber: true })}
                  className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  {...register("potUnit")}
                  className="rounded border px-2 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
              {errors.potSize && (
                <p className="text-sm text-red-600">{errors.potSize.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Pot Material</label>
              <select
                {...register("potMaterial")}
                className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select material</option>
                <option value="Terracotta">Terracotta</option>
                <option value="Plastic">Plastic</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Metal">Metal</option>
                <option value="Glass">Glass</option>
                <option value="Other">Other</option>
              </select>
              {selectedPotMaterial === "Other" && (
                <input
                  type="text"
                  {...register("potMaterialOther")}
                  className="mt-2 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Specify material"
                />
              )}
            </div>
          </div>
          <div>
            <fieldset>
              <legend className="mb-1 block text-sm font-medium">Drainage</legend>
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="drainage-poor"
                    className="flex items-center gap-2"
                    title="Water drains slowly; high risk of root rot"
                  >
                    <input
                      type="radio"
                      id="drainage-poor"
                      value="Poor"
                      {...register("drainage")}
                      aria-label="Poor drainage"
                      aria-describedby="drainage-poor-desc"
                    />
                    <span>💧 Poor</span>
                  </label>
                  <p
                    id="drainage-poor-desc"
                    className="ml-6 text-xs text-muted-foreground"
                  >
                    Water drains slowly; high risk of root rot
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="drainage-average"
                    className="flex items-center gap-2"
                    title="Standard drainage with moderate watering"
                  >
                    <input
                      type="radio"
                      id="drainage-average"
                      value="Average"
                      {...register("drainage")}
                      aria-label="Average drainage"
                      aria-describedby="drainage-average-desc"
                    />
                    <span>🪴 Average</span>
                  </label>
                  <p
                    id="drainage-average-desc"
                    className="ml-6 text-xs text-muted-foreground"
                  >
                    Standard drainage with moderate watering
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="drainage-good"
                    className="flex items-center gap-2"
                    title="Excellent drainage; water flows quickly"
                  >
                    <input
                      type="radio"
                      id="drainage-good"
                      value="Good"
                      {...register("drainage")}
                      aria-label="Good drainage"
                      aria-describedby="drainage-good-desc"
                    />
                    <span>🌿 Good</span>
                  </label>
                  <p
                    id="drainage-good-desc"
                    className="ml-6 text-xs text-muted-foreground"
                  >
                    Excellent drainage; water flows quickly
                  </p>
                </div>
              </div>
            </fieldset>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Soil Type</label>
            <input
              type="text"
              {...register("soilType")}
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Environment</h2>
          <input type="hidden" {...register("latitude")} />
          <input type="hidden" {...register("longitude")} />
          <input type="hidden" {...register("humidity")} />
          {(latitude || longitude || humidity) ? (
            <p className="text-sm text-muted-foreground">
              {latitude && longitude && (
                <>
                  Location: {latitude}, {longitude}.{' '}
                </>
              )}
              {humidity && <>Humidity: {humidity}%</>}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Fetching your location…</p>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Smart Plan</h2>
          <Button
            type="button"
            variant="secondary"
            onClick={generateCarePlan}
            disabled={loadingCare}
            className="flex items-center gap-2"
          >
            {loadingCare && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            {loadingCare ? "Generating..." : "Generate Care Plan"}
          </Button>
          {carePlan && (
            <div className="mt-2 space-y-1 rounded border bg-card p-3 text-sm text-foreground">
              <p>Water every: {carePlan.waterEvery}</p>
              <p>Fertilize: {carePlan.fertEvery} ({carePlan.fertFormula})</p>
              {carePlan.weather && (
                <p>
                  Current weather: {carePlan.weather.temperature ?? "?"}°C, {carePlan.weather.humidity ?? "?"}% humidity
                </p>
              )}
              <p className="text-muted-foreground">{carePlan.rationale}</p>
            </div>
          )}
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Ready to add &lsquo;{nameValue}&rsquo;?</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Species:</strong> {speciesValue}
            </p>
            {watch("room") && (
              <p>
                <strong>Room:</strong> {watch("room")}
              </p>
            )}
            {carePlan && (
              <p>
                <strong>Care Plan:</strong> water {carePlan.waterEvery}, fertilize {carePlan.fertEvery}
              </p>
            )}
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="mt-2 h-32 w-32 rounded object-cover"
              />
            )}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-2">
        {step > 1 && (
          <Button type="button" variant="secondary" onClick={prevStep}>
            Back
          </Button>
        )}
        {step < totalSteps && (
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed()}
            className="ml-auto"
          >
            Next
          </Button>
        )}
        {step === totalSteps && (
          <Button type="submit" className="ml-auto">
            Save Plant
          </Button>
        )}
      </div>
    </form>
  );
}

