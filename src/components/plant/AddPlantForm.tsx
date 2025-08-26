"use client";

import * as React from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { flushSync } from "react-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

type FormValues = {
  nickname: string;
  speciesScientific: string;
  speciesCommon: string;
  room_id: number | null;
  pot: string;
  light: string;
  notes: string;
  photo: FileList | null;
};

export default function AddPlantForm(): JSX.Element {
  const router = useRouter();
  const form = useForm<FormValues>({
    defaultValues: {
      nickname: "",
      speciesScientific: "",
      speciesCommon: "",
      room_id: null,
      pot: "",
      light: "",
      notes: "",
      photo: null,
    },
  });
  const [showDetails, setShowDetails] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [carePreview, setCarePreview] = React.useState<string | null>(null);
  const [_previewing, setPreviewing] = React.useState(false);
  const [errors, setErrors] = React.useState<{ nickname?: string; species?: string }>({});

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

  async function submitPlant(data: FormValues) {
    setSubmitting(true);
    try {
      const payload: CreatePayload = {
        nickname: data.nickname.trim(),
        speciesScientific: data.speciesScientific || null,
        speciesCommon: data.speciesCommon || null,
        room_id: data.room_id,
        pot: data.pot.trim() || null,
        light: data.light.trim() || null,
        notes: data.notes.trim() || null,
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
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmitData(data: FormValues) {
    setErrorMsg(null);
    const newErrors: { nickname?: string; species?: string } = {};
    if (!data.nickname.trim()) newErrors.nickname = "Please enter a nickname";
    if (!data.speciesScientific && !data.speciesCommon)
      newErrors.species = "Please select a species";
    if (Object.keys(newErrors).length > 0) {
      flushSync(() => setErrors(newErrors));
      return;
    }
    flushSync(() => setErrors({}));
    void submitPlant(data);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSubmitData(form.getValues());
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Kay"
                  className="h-10"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setErrors((er) => ({ ...er, nickname: undefined }));
                  }}
                />
              </FormControl>
              {errors.nickname && (
                <p className="text-sm text-destructive">{errors.nickname}</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="speciesScientific"
          render={() => (
            <FormItem>
              <FormLabel>Species</FormLabel>
              <FormControl>
                <SpeciesAutosuggest
                  value={
                    form.watch("speciesCommon") || form.watch("speciesScientific")
                  }
                  onSelect={(scientific, common) => {
                    form.setValue("speciesScientific", scientific);
                    form.setValue("speciesCommon", common || "");
                    setErrors((er) => ({ ...er, species: undefined }));
                    fetchPreview(scientific, common);
                  }}
                />
              </FormControl>
              {errors.species && (
                <p className="text-sm text-destructive">{errors.species}</p>
              )}
            </FormItem>
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
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <RoomSelect
                id="room"
                value={form.watch("room_id")}
                onChange={(val) => form.setValue("room_id", val)}
              />
            </div>
            <FormField
              control={form.control}
              name="pot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pot</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. 4" terracotta'
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="light"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Light</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Bright indirect"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Add notes…"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="h-10"
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  </FormControl>
                </FormItem>
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
