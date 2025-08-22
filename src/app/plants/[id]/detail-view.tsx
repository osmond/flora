"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

// shadcn/ui (individual imports to avoid barrel mismatches)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// lucide-react
import {
  ArrowLeft,
  Pencil,
  Plus,
  Camera,
  NotebookText,
  Droplets,
  Sparkles,
  ThermometerSun,
  Sun,
  ImageIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export type Plant = {
  id: string;
  name: string; // nickname
  species: string;
  room?: string;
  photoUrl?: string;
  nextWaterAt?: string | null;
  lastWaterAt?: string | null;
  waterEveryDays?: number | null;
  waterAmountMl?: number | null;
  light?: "low" | "medium" | "bright";
  pot?: { size: string; unit: "in" | "cm"; material?: string; drainage?: "poor" | "avg" | "great" } | null;
  humidity?: number | null; // %
};

export default function DetailView({ plant }: { plant: Plant }) {
  const [tab, setTab] = React.useState<"all" | "water" | "fertilize" | "notes" | "photos">("all");
  const overdue = !plant.nextWaterAt; // demo heuristic for Care Coach
  const [notes] = React.useState<string[]>([
    "Moved to brighter spot",
    "Repotted on **Aug 20**",
  ]);
  const [photos] = React.useState<string[]>(["/placeholder.svg", "/placeholder.svg"]);

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-8 bg-background min-h-screen font-inter space-y-6">
      {/* Back link */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="rounded-xl" asChild>
          <Link href="/plants">
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Link>
        </Button>
      </div>

      {/* Photo hero + title */}
      <header className="space-y-4">
        <div className="relative w-full overflow-hidden rounded-2xl border bg-muted aspect-[3/1.2]">
          <Image
            src={plant.photoUrl || "/placeholder.svg"}
            alt={plant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{plant.name}</h1>
            <p className="text-muted-foreground">
              {plant.species}
              {plant.room ? ` · ${plant.room}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="rounded-xl" size="sm">
              <Pencil className="h-4 w-4 mr-1" />Edit
            </Button>
            <Button className="rounded-xl" size="sm">
              <Plus className="h-4 w-4 mr-1" />Add Note
            </Button>
            <Button className="rounded-xl" size="sm" variant="secondary">
              <Camera className="h-4 w-4 mr-1" />Add Photo
            </Button>
          </div>
        </div>
      </header>

      {/* Quick stats */}
      <Card className="border rounded-2xl shadow-card">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-2">
            <Stat label="Water" value={waterText(plant)} icon={<Droplets className="h-3.5 w-3.5" />} />
            {plant.light && <Stat label="Light" value={titleCase(plant.light)} icon={<Sun className="h-3.5 w-3.5" />} />}
            {plant.humidity != null && (
              <Stat label="Humidity" value={`${plant.humidity}%`} icon={<ThermometerSun className="h-3.5 w-3.5" />} />
            )}
            {plant.pot && (
              <Stat
                label="Pot"
                value={`${plant.pot.size}${plant.pot.unit} ${plant.pot.material ?? ""}`.trim()}
                icon={<ImageIcon className="h-3.5 w-3.5" />}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Care Coach (overdue only) */}
      {overdue && (
        <Card className="bg-primary/10 border border-primary/40 rounded-2xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" /> Care Coach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Looks like watering is overdue. Check the top 1–2 cm of soil; if it’s dry, water ~{plant.waterAmountMl ?? 120} ml.
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" className="rounded-xl">
                <CheckCircle2 className="h-4 w-4 mr-1" />Mark Watered
              </Button>
              <Button size="sm" variant="secondary" className="rounded-xl">
                <Clock className="h-4 w-4 mr-1" />Snooze
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity */}
      <Card className="border rounded-2xl shadow-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <NotebookText className="h-5 w-5 text-primary" /> Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="water">Water</TabsTrigger>
              <TabsTrigger value="fertilize">Fertilize</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
            </TabsList>

            {/* Timeline demo */}
            <TabsContent value="all" className="space-y-4 pt-3">
              <TimelineItem icon={<Droplets className="h-4 w-4 text-primary" />} title="Watered" meta="Aug 14" note="~120 ml" />
              <TimelineItem
                icon={<Sparkles className="h-4 w-4 text-primary" />} title="Fertilized" meta="Aug 01" note="10-10-10 at ½ strength"
              />
              <TimelineItem
                icon={<NotebookText className="h-4 w-4 text-primary" />} title="Note" meta="Jul 28" note="Moved to brighter spot"
              />
            </TabsContent>

            <TabsContent value="water" className="space-y-4 pt-3">
              <TimelineItem icon={<Droplets className="h-4 w-4 text-primary" />} title="Watered" meta="Aug 14" note="~120 ml" />
            </TabsContent>

            <TabsContent value="fertilize" className="space-y-4 pt-3">
              <TimelineItem icon={<Sparkles className="h-4 w-4 text-primary" />} title="Fertilized" meta="Aug 01" note="10-10-10 ½ strength" />
            </TabsContent>

            {/* Notes composer */}
            <TabsContent value="notes" className="space-y-3 pt-3">
              {notes.map((n, i) => (
                <Card key={i} className="rounded-2xl shadow-card">
                  <CardContent className="p-4 text-sm">
                    <ReactMarkdown>{n}</ReactMarkdown>
                  </CardContent>
                </Card>
              ))}
              <Label htmlFor="note" className="text-sm font-medium">
                Add a note
              </Label>
              <Textarea id="note" rows={3} className="rounded-xl" placeholder="What did you observe?" />
              <div className="flex justify-end">
                <Button size="sm" className="rounded-xl">
                  <Plus className="h-4 w-4 mr-1" />Save Note
                </Button>
              </div>
            </TabsContent>

            {/* Gallery */}
            <TabsContent value="photos" className="space-y-3 pt-3">
              <div className="grid grid-cols-3 gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-xl border">
                    <Image src={src} alt="Photo" fill className="object-cover" />
                  </div>
                ))}
                <div className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- UI Pieces ---------------- */
function Stat({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs">
      {icon} <span className="font-medium">{label}:</span> {value}
    </span>
  );
}

function TimelineItem({
  icon,
  title,
  meta,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  note?: string;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full gap-3 text-left">
        <div className="mt-1">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium">{title}</div>
            <div className="text-xs text-muted-foreground">{meta}</div>
          </div>
          {open && note && <p className="text-sm text-muted-foreground mt-0.5">{note}</p>}
        </div>
      </button>
    </div>
  );
}

/* ---------------- Helpers ---------------- */
function waterText(p: Plant): string {
  if (p.waterEveryDays && p.waterAmountMl) return `every ${p.waterEveryDays}d · ~${p.waterAmountMl} ml`;
  if (p.waterEveryDays) return `every ${p.waterEveryDays}d`;
  return "custom";
}

function titleCase(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}
