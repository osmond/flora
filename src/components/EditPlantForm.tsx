"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import {
  Button,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui";
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
      .number()
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

  const form = useForm<EditPlantFormValues>({
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

  const selectedPotMaterial = form.watch("potMaterial");
  const selectedSoilType = form.watch("soilType");
  const speciesValue = form.watch("species");

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Plant Details</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nickname</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SpeciesAutosuggest
                    value={speciesValue}
                    onSelect={(scientific: string, common?: string) => {
                      field.onChange(scientific);
                      form.setValue("commonName", common || "", {
                        shouldValidate: true,
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room</FormLabel>
                <FormControl>
                  <Input list="room-options" {...field} />
                </FormControl>
                <datalist id="room-options">
                  {rooms.map((r) => (
                    <option key={r} value={r} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="indoor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Indoor">🏠 Indoor</SelectItem>
                    <SelectItem value="Outdoor">🌳 Outdoor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lightLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Light Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Low">☁️ Low</SelectItem>
                    <SelectItem value="Medium">⛅ Medium</SelectItem>
                    <SelectItem value="Bright">☀️ Bright</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-xl border bg-card p-6 text-foreground shadow-sm">
          <h2 className="text-lg font-medium">Pot Setup</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="potSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pot Size</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="number" min={1} max={100} step={1} {...field} />
                      <FormField
                        control={form.control}
                        name="potUnit"
                        render={({ field: unitField }) => (
                          <FormControl>
                            <Select
                              onValueChange={unitField.onChange}
                              value={unitField.value}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="in">in</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        )}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="potMaterial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pot Material</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Terracotta">Terracotta</SelectItem>
                      <SelectItem value="Plastic">Plastic</SelectItem>
                      <SelectItem value="Ceramic">Ceramic</SelectItem>
                      <SelectItem value="Metal">Metal</SelectItem>
                      <SelectItem value="Glass">Glass</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedPotMaterial === "Other" && (
                    <FormField
                      control={form.control}
                      name="potMaterialOther"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Specify material"
                            className="mt-2"
                          />
                        </FormControl>
                      )}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="drainage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Drainage</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-2"
                  >
                    <div className="space-y-2">
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Poor" id="drainage-poor" />
                        </FormControl>
                        <FormLabel htmlFor="drainage-poor" className="font-normal">
                          💧 Poor
                        </FormLabel>
                      </FormItem>
                      <p
                        id="drainage-poor-desc"
                        className="ml-6 text-xs text-muted-foreground"
                      >
                        Water drains slowly; high risk of root rot
                      </p>
                    </div>
                    <div className="space-y-2">
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="Average"
                            id="drainage-average"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="drainage-average"
                          className="font-normal"
                        >
                          🪴 Average
                        </FormLabel>
                      </FormItem>
                      <p
                        id="drainage-average-desc"
                        className="ml-6 text-xs text-muted-foreground"
                      >
                        Standard drainage with moderate watering
                      </p>
                    </div>
                    <div className="space-y-2">
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Good" id="drainage-good" />
                        </FormControl>
                        <FormLabel htmlFor="drainage-good" className="font-normal">
                          🌿 Good
                        </FormLabel>
                      </FormItem>
                      <p
                        id="drainage-good-desc"
                        className="ml-6 text-xs text-muted-foreground"
                      >
                        Excellent drainage; water flows quickly
                      </p>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="soilType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soil Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select soil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Loamy">Loamy</SelectItem>
                    <SelectItem value="Sandy">Sandy</SelectItem>
                    <SelectItem value="Clay">Clay</SelectItem>
                    <SelectItem value="Silty">Silty</SelectItem>
                    <SelectItem value="Peaty">Peaty</SelectItem>
                    <SelectItem value="Chalky">Chalky</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {selectedSoilType === "Other" && (
                  <FormField
                    control={form.control}
                    name="soilTypeOther"
                    render={({ field }) => (
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Specify soil type"
                          className="mt-2"
                        />
                      </FormControl>
                    )}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  );
}

