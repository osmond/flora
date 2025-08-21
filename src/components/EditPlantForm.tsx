"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SpeciesAutosuggest from "@/components/SpeciesAutosuggest";

const formSchema = z
  .object({
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
    soilType: z.string().min(1, "Soil type is required"),
    soilTypeOther: z.string().optional(),
    lightLevel: z.string().optional(),
    indoor: z.string().optional(),
  })
  .refine((data) => data.soilType !== "Other" || !!data.soilTypeOther, {
    message: "Please specify soil type",
    path: ["soilTypeOther"],
  });

export type EditPlantFormValues = z.infer<typeof formSchema>;

interface EditPlantFormProps {
  plant: {
    id: string;
    name: string;
    species: string;
    common_name: string | null;
    room: string | null;
    pot_size: string | null;
    pot_material: string | null;
    drainage: string | null;
    soil_type: string | null;
    light_level: string | null;
    indoor: string | null;
  };
}

const potMaterials = ["Terracotta", "Plastic", "Ceramic", "Metal", "Glass"] as const;
const soilTypes = ["Loamy", "Sandy", "Clay", "Silty", "Peaty", "Chalky"] as const;

export default function EditPlantForm({ plant }: EditPlantFormProps) {
  const router = useRouter();
  const [rooms, setRooms] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data.data || []))
      .catch((err) => console.error("Failed to load rooms:", err));
  }, []);

  const potSizeMatch = plant.pot_size?.match(/(\d+)\s*(cm|in)?/);
  const defaultPotSize = potSizeMatch ? Number(potSizeMatch[1]) : undefined;
  const defaultPotUnit = (potSizeMatch?.[2] as "cm" | "in") || "cm";

  const defaultPotMaterial =
    plant.pot_material &&
    potMaterials.includes(plant.pot_material as (typeof potMaterials)[number])
      ? plant.pot_material
      : plant.pot_material
      ? "Other"
      : "";
  const defaultPotMaterialOther =
    defaultPotMaterial === "Other" ? plant.pot_material || "" : "";

  const defaultSoilType =
    plant.soil_type &&
    soilTypes.includes(plant.soil_type as (typeof soilTypes)[number])
      ? plant.soil_type
      : plant.soil_type
      ? "Other"
      : "";
  const defaultSoilTypeOther =
    defaultSoilType === "Other" ? plant.soil_type || "" : "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditPlantFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: plant.name,
      species: plant.species,
      commonName: plant.common_name || "",
      room: plant.room || "",
      potSize: defaultPotSize,
      potUnit: defaultPotUnit,
      potMaterial: defaultPotMaterial,
      potMaterialOther: defaultPotMaterialOther,
      drainage: plant.drainage || "",
      soilType: defaultSoilType || "",
      soilTypeOther: defaultSoilTypeOther,
      lightLevel: plant.light_level || "",
      indoor: plant.indoor || "",
    },
  });

  const selectedPotMaterial = watch("potMaterial");
  const selectedSoilType = watch("soilType");
  const speciesValue = watch("species");

  const onSubmit = async (data: EditPlantFormValues) => {
    const pot_size =
      data.potSize !== undefined
        ? `${data.potSize}${data.potUnit ? ` ${data.potUnit}` : ""}`
        : null;
    const pot_material =
      data.potMaterial === "Other" ? data.potMaterialOther || null : data.potMaterial || null;
    const soil_type =
      data.soilType === "Other" ? data.soilTypeOther || null : data.soilType || null;

    const res = await fetch(`/api/plants/${plant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        species: data.species,
        common_name: data.commonName || null,
        room: data.room || null,
        pot_size,
        pot_material,
        drainage: data.drainage || null,
        soil_type,
        light_level: data.lightLevel || null,
        indoor: data.indoor || null,
      }),
    });

    if (res.ok) {
      toast("Plant updated!");
      router.push(`/plants/${plant.id}`);
      router.refresh();
    } else {
      toast("Failed to update plant");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this plant?")) return;
    const res = await fetch(`/api/plants/${plant.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Plant deleted");
      router.push("/plants");
      router.refresh();
    } else {
      toast("Failed to delete plant");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
        <h2 className="text-lg font-medium">Plant Details</h2>
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
          <select
            {...register("soilType")}
            className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select soil</option>
            <option value="Loamy">Loamy</option>
            <option value="Sandy">Sandy</option>
            <option value="Clay">Clay</option>
            <option value="Silty">Silty</option>
            <option value="Peaty">Peaty</option>
            <option value="Chalky">Chalky</option>
            <option value="Other">Other</option>
          </select>
          {selectedSoilType === "Other" && (
            <input
              type="text"
              {...register("soilTypeOther")}
              className="mt-2 w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Specify soil type"
            />
          )}
          {errors.soilType && (
            <p className="text-sm text-red-600">{errors.soilType.message}</p>
          )}
          {errors.soilTypeOther && (
            <p className="text-sm text-red-600">{errors.soilTypeOther.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Save Plant</Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
        >
          Delete Plant
        </Button>
      </div>
    </form>
  );
}

