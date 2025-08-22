"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";

// shadcn/ui - import from individual component paths
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

// lucide-react icons
import {
  Flower2, MapPin, Box, ThermometerSun, Sparkles, Leaf,
  Droplet, Droplets, Sun, Home, Trees, Ruler,
  ChevronLeft, ChevronRight, CheckCircle2,
} from "lucide-react";

const FormSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  species: z.string().min(1, "Pick a species"),
  room: z.string().min(1, "Choose a room"),
  location: z.enum(["indoor", "outdoor"]).default("indoor"),
  light: z.enum(["low", "medium", "bright"]).default("medium"),
  potSize: z.string().min(1, "Add a pot size"),
  potUnit: z.enum(["in", "cm"]).default("in"),
  potMaterial: z.enum(["terracotta", "ceramic", "plastic"]).optional(),
  drainage: z.enum(["poor", "avg", "great"]).default("avg"),
  soil: z.enum(["loam", "cactus", "orchid"]).optional(),
  humidityOptIn: z.boolean().default(true),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AddPlantPage() {
  const [step, setStep] = React.useState(1);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nickname: "",
      species: "",
      room: "",
      location: "indoor",
      light: "medium",
      potSize: "6",
      potUnit: "in",
      potMaterial: "terracotta",
      drainage: "avg",
      soil: "loam",
      humidityOptIn: true,
      notes: "",
    },
    mode: "onBlur",
  });

  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.set("name", values.nickname);
      formData.set("species", values.species);
      formData.set("room", values.room);
      formData.set("indoor", values.location);
      formData.set("light_level", values.light);
      formData.set("pot_size", `${values.potSize}${values.potUnit ? ` ${values.potUnit}` : ""}`);
      if (values.potMaterial) formData.set("pot_material", values.potMaterial);
      formData.set("drainage", values.drainage);
      if (values.soil) formData.set("soil_type", values.soil);

      const res = await fetch("/api/plants", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save plant");
      }

      toast("Plant added!");
      router.push("/plants");
      router.refresh();
    } catch (err) {
      console.error("Submit Add Plant error:", err);
      toast("Failed to add plant");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 bg-background min-h-screen font-inter">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add a Plant</h1>
        <Stepper step={step} labels={["Identify","Place","Pot","Environment","Smart Plan","Confirm"]} />
      </header>

      <form className="space-y-0" onSubmit={form.handleSubmit(onSubmit)}>
        {step === 1 && <Identify form={form} />}
        {step === 2 && <Place form={form} />}
        {step === 3 && <PotSetup form={form} />}
        {step === 4 && <Environment form={form} />}
        {step === 5 && <SmartPlan form={form} />}
        {step === 6 && <Confirm form={form} />}

        {/* Sticky footer nav */}
        <footer className="sticky bottom-0 mt-8 bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-muted/20 border-t border-muted rounded-t-xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 6 ? (
              <Button
                type="button"
                onClick={() => setStep((s) => Math.min(6, s + 1))}
                className="rounded-xl bg-primary text-primary-foreground hover:opacity-95"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" className="rounded-xl bg-primary text-primary-foreground">
                <CheckCircle2 className="h-4 w-4 mr-1" /> Save Plant
              </Button>
            )}
          </div>
        </footer>
      </form>
    </div>
  );
}

function Stepper({ step, labels }: { step: number; labels: string[] }) {
  const icons = [Flower2, MapPin, Box, ThermometerSun, Sparkles, Leaf] as const;
  return (
    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
      {labels.map((l, i) => {
        const Icon = icons[i]!;
        const active = i + 1 <= step;
        return (
          <React.Fragment key={l}>
            <div
              className={[
                "h-8 px-3 rounded-full border flex items-center gap-2 shadow-sm",
                active ? "bg-accent/60 border-accent text-foreground" : "bg-muted/50 border-muted",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 text-primary" /> {i + 1}. {l}
            </div>
            {i < labels.length - 1 && <div className="flex-1 h-px bg-border hidden md:block" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  id?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="font-medium text-sm">{label}</Label>
        {required && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Required</span>
        )}
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Identify({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { register, formState: { errors } } = form;
  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Flower2 className="h-5 w-5 text-primary" /> Identify
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <Field label="Nickname" id="nickname" required hint="What you call this plant at home." error={errors.nickname?.message}>
          <Input id="nickname" {...register("nickname")} placeholder="e.g., Kay" aria-invalid={!!errors.nickname} className="h-11 rounded-xl" />
        </Field>

        <Field label="Species" id="species" required hint="Start typing to search." error={errors.species?.message}>
          {/* Swap with your real <SpeciesAutosuggest /> when ready */}
          <Input id="species" {...register("species")} placeholder="Monstera deliciosa" aria-invalid={!!errors.species} className="h-11 rounded-xl" />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Notes" id="notes">
            <Textarea id="notes" {...register("notes")} rows={3} placeholder="Optional notes" className="rounded-xl" />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Place({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { control } = form;
  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" /> Place
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <Field label="Room" id="room" required>
          <Controller
            control={control}
            name="room"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="room" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living">Living Room</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Location" id="location" required>
          <Controller
            control={control}
            name="location"
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value="indoor" id="indoor" /> <Home className="h-4 w-4 text-primary" /> Indoor
                </label>
                <label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value="outdoor" id="outdoor" /> <Trees className="h-4 w-4 text-primary" /> Outdoor
                </label>
              </RadioGroup>
            )}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Light Level" id="light" required>
            <Controller
              control={control}
              name="light"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="light" className="h-11 rounded-xl">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">☁️ Low</SelectItem>
                    <SelectItem value="medium">⛅ Medium</SelectItem>
                    <SelectItem value="bright">☀️ Bright</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function PotSetup({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { control, register } = form;
  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" /> Pot Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <Field label="Pot Size" id="potSize" required>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <div className="relative">
              <Ruler className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="potSize" className="pl-8 h-11 rounded-xl" {...register("potSize")} />
            </div>
            <Controller
              control={control}
              name="potUnit"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-28 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">in</SelectItem>
                    <SelectItem value="cm">cm</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </Field>

        <Field label="Pot Material" id="potMaterial">
          <Controller
            control={control}
            name="potMaterial"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="potMaterial" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terracotta">Terracotta</SelectItem>
                  <SelectItem value="ceramic">Ceramic</SelectItem>
                  <SelectItem value="plastic">Plastic</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field label="Soil" id="soil">
          <Controller
            control={control}
            name="soil"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="soil" className="h-11 rounded-xl">
                  <SelectValue placeholder="Select soil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loam">Loam</SelectItem>
                  <SelectItem value="cactus">Cactus</SelectItem>
                  <SelectItem value="orchid">Orchid</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Drainage" id="drainage" required>
            <Controller
              control={control}
              name="drainage"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-2 sm:grid-cols-3">
                  <label className="flex items-start gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                    <RadioGroupItem value="poor" id="dr-poor" />
                    <div>
                      <div className="font-medium flex items-center gap-1 text-destructive"><Droplet className="h-4 w-4" />Poor</div>
                      <p className="text-xs text-muted-foreground">Slow drainage; higher risk of root rot.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                    <RadioGroupItem value="avg" id="dr-avg" />
                    <div>
                      <div className="font-medium flex items-center gap-1"><Droplets className="h-4 w-4 text-primary" />Average</div>
                      <p className="text-xs text-muted-foreground">Standard drainage; moderate watering.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                    <RadioGroupItem value="great" id="dr-great" />
                    <div>
                      <div className="font-medium flex items-center gap-1 text-primary"><Droplets className="h-4 w-4" />Great</div>
                      <p className="text-xs text-muted-foreground">Excellent drainage; water flows quickly.</p>
                    </div>
                  </label>
                </RadioGroup>
              )}
            />
          </Field>
        </div>
      </CardContent>
    </Card>
  );
}

function Environment({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const { control } = form;
  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ThermometerSun className="h-5 w-5 text-primary" /> Environment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2 text-sm">
          <Chip><MapPin className="h-3 w-3" /> Minneapolis, MN</Chip>
          <Chip><ThermometerSun className="h-3 w-3" /> 58% humidity</Chip>
          <Chip><Sun className="h-3 w-3" /> Bright indirect</Chip>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <div className="font-medium">Use local humidity</div>
            <p className="text-xs text-muted-foreground">Personalize watering by current humidity.</p>
          </div>
          <Controller
            control={control}
            name="humidityOptIn"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SmartPlan({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const [plan, setPlan] = React.useState<
    | {
        waterEvery: string;
        waterAmountMl: number;
        fertEvery: string;
        fertFormula: string;
        rationale: string;
      }
    | null
  >(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGenerate = async () => {
    const values = form.getValues();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          species: values.species,
          potSize: parseFloat(values.potSize),
          potUnit: values.potUnit,
          lightLevel: values.light,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate care plan");
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error("Generate care plan error:", err);
      setError("Failed to generate care plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Smart Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          className="inline-flex items-center rounded-xl"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? "Generating..." : "Generate Care Plan"}
        </Button>
        <div className="rounded-xl border p-4 bg-accent/40">
          {loading ? (
            <p className="text-sm">Loading...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : plan ? (
            <ul className="list-disc pl-5 text-sm">
              <li>
                Water every {plan.waterEvery} — ~{plan.waterAmountMl} ml
              </li>
              <li>
                Fertilize {plan.fertEvery} — {plan.fertFormula}
              </li>
              <li>Why: {plan.rationale}</li>
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No plan generated yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Confirm({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  const values = form.getValues();
  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Leaf className="h-5 w-5 text-primary" /> Confirm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-xl border p-4">
          <div className="grid sm:grid-cols-2 gap-2">
            <Summary label="Species" value={`${values.nickname || "(unnamed)"} · ${values.species || "(species)"}`} />
            <Summary label="Room" value={values.room || "—"} />
            <Summary label="Light" value={values.light} />
            <Summary label="Pot" value={`${values.potSize}${values.potUnit} ${values.potMaterial}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Summary({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border bg-accent/40 px-2.5 py-1 text-xs">
      {children}
    </span>
  );
}
