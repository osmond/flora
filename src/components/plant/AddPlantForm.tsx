"use client";

import * as React from "react";
import { useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SpeciesAutosuggest from "./SpeciesAutosuggest";
import { RoomSelect } from "./RoomSelect";

type CreatePayload = {
  nickname: string;
  speciesScientific?: string | null;
  speciesCommon?: string | null;
  room_id?: number | null;
  pot?: string | null;
  light?: string | null;
  notes?: string | null;
};

const formSchema = z.object({
  nickname: z.string().min(1, "Please enter a nickname"),
  species: z.string().min(1, "Please enter a species"),
  room_id: z.number().nullable().optional(),
  pot: z.string().optional(),
  light: z.string().optional(),
  notes: z.string().optional(),
  photo: z.any().optional(),
});

export default function AddPlantForm(): JSX.Element {
  const router = useRouter();
  const [speciesScientific, setSpeciesScientific] = useState<string>("");
  const [speciesCommon, setSpeciesCommon] = useState<string>("");
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [carePreview, setCarePreview] = useState<string | null>(null);
  const [_previewing, setPreviewing] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
      species: "",
      room_id: null,
      pot: "",
      light: "",
      notes: "",
      photo: null,
    },
  });

  async function fetchPreview(scientific: string, common?: string) {
    setCarePreview(null);
    setPreviewing(true);
    try {
      const species = common || scientific;
      const res = await fetch(
        `/api/ai-care/preview?species=${encodeURIComponent(species)}`,
      );
      const json = await res.json();
      setCarePreview(typeof json?.preview === "string" ? json.preview : null);
    } catch {
      setCarePreview(null);
    } finally {
      setPreviewing(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg(null);
    try {
      const payload: CreatePayload = {
        nickname: values.nickname.trim(),
        speciesScientific: speciesScientific || null,
        speciesCommon: speciesCommon || values.species || null,
        room_id: values.room_id ?? null,
        pot: values.pot?.trim() || null,
        light: values.light?.trim() || null,
        notes: values.notes?.trim() || null,
      };

      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Create failed");

      const id: string | number | undefined = json?.plant?.id;
      router.push(id ? `/plants/${id}` : "/plants");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Create failed");
    }
  }

  const submitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input id="nickname" placeholder="e.g. Kay" className="h-10" {...field} />
              {form.formState.errors.nickname && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.nickname.message}
                </p>
              )}
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Species</Label>
              <SpeciesAutosuggest
                value={field.value}
                onSelect={(scientific, common) => {
                  setSpeciesScientific(scientific);
                  setSpeciesCommon(common || "");
                  field.onChange(common || scientific);
                  fetchPreview(scientific, common);
                }}
                onInputChange={(val) => {
                  setSpeciesScientific("");
                  setSpeciesCommon("");
                  field.onChange(val);
                }}
              />
              {form.formState.errors.species && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.species.message}
                </p>
              )}
            </div>
          )}
        />

        {carePreview && (
          <div className="rounded-md border bg-secondary/30 p-4 text-sm">
            <p className="font-medium">AI Care Preview</p>
            <p className="text-muted-foreground">{carePreview}</p>
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => setShowDetails((s) => !s)}
            className="text-sm text-muted-foreground underline"
          >
            {showDetails ? "Hide details" : "Add details"}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="room_id"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="room">Room</Label>
                  <RoomSelect id="room" value={field.value ?? null} onChange={field.onChange} />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="pot"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="pot">Pot</Label>
                  <Input
                    id="pot"
                    placeholder='e.g. 4" terracotta'
                    className="h-10"
                    {...field}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="light"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="light">Light</Label>
                  <Input
                    id="light"
                    placeholder="e.g. Bright indirect"
                    className="h-10"
                    {...field}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    placeholder="Add notes…"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                    {...field}
                  />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="h-10"
                    onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                  />
                </div>
              )}
            />
          </div>
        )}

        {errorMsg ? (
          <p className="text-sm text-destructive">{errorMsg}</p>
        ) : null}

        <Button type="submit" className="w-full h-10" disabled={submitting}>
          {submitting ? "Creating…" : "Create Plant"}
        </Button>
      </form>
    </Form>
  );
}
