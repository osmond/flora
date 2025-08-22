"use client";

import React from "react";
import {
  Flower2,
  MapPin,
  Box,
  ThermometerSun,
  Sparkles,
  Leaf,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Ruler,
  Home,
  Trees,
  Droplet,
  Droplets,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AddPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 bg-background min-h-screen font-inter space-y-8">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Add a Plant</h1>
        <Stepper
          step={2}
          labels={["Identify", "Place", "Pot", "Environment", "Smart Plan", "Confirm"]}
        />
      </header>

      <Section icon={<Flower2 className="h-5 w-5 text-primary" />} title="Identify">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Nickname" hint="What you call this plant at home." required>
            <Input className="h-11 rounded-xl" placeholder="e.g., Kay" />
          </Field>
          <Field label="Species" hint="Start typing to search." required>
            <Input className="h-11 rounded-xl" placeholder="Monstera deliciosa" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea
                className="rounded-xl"
                rows={3}
                placeholder="Optional notes"
              />
            </Field>
          </div>
        </div>
      </Section>

      <Section icon={<MapPin className="h-5 w-5 text-primary" />} title="Place">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Room" required>
            <Select>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="living">Living room</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Location" required>
            <RadioGroup className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <RadioGroupItem value="indoor" id="indoor" />
                <Home className="h-4 w-4 text-primary" /> Indoor
              </label>
              <label className="flex items-center gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                <RadioGroupItem value="outdoor" id="outdoor" />
                <Trees className="h-4 w-4 text-primary" /> Outdoor
              </label>
            </RadioGroup>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Light level" required>
              <Select>
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Choose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">☁️ Low</SelectItem>
                  <SelectItem value="medium">⛅ Medium</SelectItem>
                  <SelectItem value="bright">☀️ Bright</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </div>
      </Section>

      <Section icon={<Box className="h-5 w-5 text-primary" />} title="Pot Setup">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Pot size" required>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="relative">
                <Ruler className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8 h-11 rounded-xl" placeholder="6" />
              </div>
              <Select>
                <SelectTrigger className="w-28 h-11 rounded-xl">
                  <SelectValue placeholder="in" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">in</SelectItem>
                  <SelectItem value="cm">cm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Field>
          <Field label="Pot material">
            <Select>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="terracotta">Terracotta</SelectItem>
                <SelectItem value="ceramic">Ceramic</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Drainage" required>
              <RadioGroup className="grid gap-2 sm:grid-cols-3">
                <label className="flex items-start gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value="poor" id="dr-poor" />
                  <div>
                    <div className="font-medium flex items-center gap-1 text-destructive">
                      <Droplet className="h-4 w-4" /> Poor
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Slow drainage; higher risk of root rot.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value="avg" id="dr-avg" />
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-primary" /> Average
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Standard drainage; moderate watering.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-2 rounded-xl border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
                  <RadioGroupItem value="great" id="dr-great" />
                  <div>
                    <div className="font-medium flex items-center gap-1 text-primary">
                      <Droplets className="h-4 w-4" /> Great
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Excellent drainage; water flows quickly.
                    </p>
                  </div>
                </label>
              </RadioGroup>
            </Field>
          </div>
        </div>
      </Section>

      <Section
        icon={<ThermometerSun className="h-5 w-5 text-primary" />}
        title="Environment"
      >
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 text-sm">
            <Chip>
              <MapPin className="h-3 w-3" /> Minneapolis, MN
            </Chip>
            <Chip>
              <ThermometerSun className="h-3 w-3" /> 58% humidity
            </Chip>
            <Chip>
              <Sun className="h-3 w-3" /> Bright indirect
            </Chip>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <div className="font-medium">Use local humidity</div>
              <p className="text-xs text-muted-foreground">
                Personalize watering by current humidity.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Section>

      <Section icon={<Sparkles className="h-5 w-5 text-primary" />} title="Smart Plan">
        <div className="space-y-3">
          <Button
            variant="secondary"
            className="rounded-xl inline-flex items-center"
          >
            <Sparkles className="h-4 w-4 mr-2" /> Generate Care Plan
          </Button>
          <div className="rounded-xl border p-4 bg-accent/40 text-sm">
            <ul className="list-disc pl-5">
              <li>Water every 5 days — ~120 ml</li>
              <li>Fertilize monthly — 10-10-10 at 1/2 strength</li>
              <li>Why: 6 in terracotta, great drainage, medium light</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={<Leaf className="h-5 w-5 text-primary" />} title="Confirm">
        <div className="space-y-4 text-sm">
          <div className="rounded-xl border p-4">
            <div className="grid sm:grid-cols-2 gap-2">
              <Summary label="Species" value="Kay · Monstera deliciosa" />
              <Summary label="Room" value="Kitchen" />
              <Summary label="Light" value="Medium" />
              <Summary label="Pot" value="6in Terracotta" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="rounded-xl bg-primary text-primary-foreground">
              <CheckCircle2 className="h-4 w-4 mr-1" /> Save Plant
            </Button>
          </div>
        </div>
      </Section>

      <footer className="sticky bottom-0 mt-8 bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-muted/20 border-t border-muted rounded-t-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
          <Button variant="secondary" className="rounded-xl">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button className="rounded-xl bg-primary text-primary-foreground">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="bg-card/95 border border-muted rounded-2xl shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="font-medium text-sm">{label}</Label>
        {required && (
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Required
          </span>
        )}
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Stepper({
  step,
  labels,
}: {
  step: number;
  labels: string[];
}) {
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
                active
                  ? "bg-accent/60 border-accent text-foreground"
                  : "bg-muted/50 border-muted",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 text-primary" /> {i + 1}. {l}
            </div>
            {i < labels.length - 1 && (
              <div className="flex-1 h-px bg-border hidden md:block" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
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

