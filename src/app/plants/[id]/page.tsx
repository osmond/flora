"use client";

import React from "react";
import Link from "next/link";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Textarea,
  Label,
} from "@/components/ui";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Pencil,
  Plus,
  Camera,
  Trash2,
  UploadCloud,
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

type Plant = {
  id: string;
  name: string;
  species: string;
  room: string;
  lastWatered: string;
  nextWatering: string;
  photoUrl?: string;
  notes?: string;
};

export default function PlantDetailPage() {
  const plant: Plant = {
    id: "1",
    name: "Kay",
    species: "Monstera deliciosa",
    room: "Living Room",
    lastWatered: "2025-08-18",
    nextWatering: "2025-08-25",
    photoUrl: "",
    notes: "Thriving near the east window.",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/plants">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">{plant.name}</h1>
      </div>

      {/* Photo / Quick Actions */}
      <Card>
        <CardContent className="flex flex-col items-center p-6 space-y-4">
          {plant.photoUrl ? (
            <img
              src={plant.photoUrl}
              alt={plant.name}
              className="rounded-xl object-cover h-48 w-full"
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm">
              <Camera className="h-4 w-4 mr-1" /> Add Photo
            </Button>
            <Button size="sm" variant="secondary">
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 text-sm">
          <Badge variant="secondary">
            <Droplets className="h-3 w-3 mr-1" /> Last watered:{" "}
            {plant.lastWatered}
          </Badge>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" /> Next watering: {plant.nextWatering}
          </Badge>
        </CardContent>
      </Card>

      {/* Tabs for Timeline / Notes */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Watered on {plant.lastWatered}
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Next watering due {plant.nextWatering}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={plant.notes}
                placeholder="Write your notes here..."
              />
              <div className="mt-2 flex justify-end">
                <Button size="sm">Save Note</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Danger Zone */}
      <div className="flex justify-end">
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" /> Delete Plant
        </Button>
      </div>
    </div>
  );
}
