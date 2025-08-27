"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import SpeciesAutosuggest from "./SpeciesAutosuggest";
import { RoomSelect } from "./RoomSelect";

const STORAGE_KEY = "addPlantForm";

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
  const [step, setStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [carePreview, setCarePreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
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

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        form.reset({ ...form.getValues(), ...parsed });
      } catch {
        /* ignore */
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      const { photo, ...rest } = value;
      const isEmpty = Object.values(rest).every(
        (v) => v === "" || v === null || v === undefined,
      );
      if (isEmpty) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function fetchPreview(scientific: string, common?: string) {
    setCarePreview(null);
    setPreviewError(null);
    setPreviewing(true);
    try {
      const species = common || scientific;
      const res = await fetch(
        `/api/ai-care/preview?species=${encodeURIComponent(species)}`,
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Preview failed");
      setCarePreview(typeof json?.preview === "string" ? json.preview : null);
    } catch (err) {
      setCarePreview(null);
      setPreviewError(err instanceof Error ? err.message : "Preview failed");
    } finally {
      setPreviewing(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg(null);
    try {
      const formData = new FormData();
      formData.append("nickname", values.nickname.trim());
      formData.append(
        "speciesScientific",
        (speciesScientific || values.species).trim(),
      );
      formData.append(
        "speciesCommon",
        speciesCommon || values.species || "",
      );
      if (values.room_id != null)
        formData.append("room_id", String(values.room_id));
      if (values.pot) formData.append("pot", values.pot.trim());
      if (values.light) formData.append("light", values.light.trim());
      if (values.notes) formData.append("notes", values.notes.trim());
      if (values.photo) formData.append("photo", values.photo);

      const res = await fetch("/api/plants", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Create failed");

      localStorage.removeItem(STORAGE_KEY);

      const id: string | number | undefined = json?.plant?.id;
      const imageUrl: string | undefined = json?.plant?.image_url;
      // imageUrl can be used for further client-side handling if needed
      router.push(id ? `/plants/${id}` : "/plants");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Create failed");
    }
  }

  const submitting = form.formState.isSubmitting;
  const totalSteps = 3;
  const errorFields = Object.keys(form.formState.errors);

  async function handleNext() {
    if (step === 1) {
      const valid = await form.trigger(["nickname", "species"]);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  }

  function handleBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleReset() {
    form.reset();
    setSpeciesScientific("");
    setSpeciesCommon("");
    setCarePreview(null);
    setPreviewError(null);
    setPhotoPreview(null);
    setStep(1);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div aria-live="polite" className="sr-only">
          {errorFields.length > 0
            ? `Please fix the following fields: ${errorFields.join(", ")}.`
            : ""}
        </div>
        <div className="space-y-2">
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-center">Step {step} of {totalSteps}</p>
        </div>

        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    placeholder="e.g. Kay"
                    className="h-10"
                    aria-invalid={!!form.formState.errors.nickname}
                    aria-describedby={
                      form.formState.errors.nickname ? "nickname-error" : undefined
                    }
                    {...field}
                  />
                  {form.formState.errors.nickname && (
                    <p id="nickname-error" className="text-sm text-destructive">
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
                      setCarePreview(null);
                      setPreviewError(null);
                      field.onChange(val);
                    }}
                    inputProps={{
                      id: "species",
                      "aria-invalid": !!form.formState.errors.species,
                      "aria-describedby": form.formState.errors.species
                        ? "species-error"
                        : undefined,
                    }}
                  />
                  {form.formState.errors.species && (
                    <p id="species-error" className="text-sm text-destructive">
                      {form.formState.errors.species.message}
                    </p>
                  )}
                </div>
              )}
            />

            {previewing ? (
              <div className="rounded-md border bg-secondary/30 p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : carePreview ? (
              <div className="rounded-md border bg-secondary/30 p-4 text-sm">
                <p className="font-medium">AI Care Preview</p>
                <p className="text-muted-foreground">{carePreview}</p>
              </div>
            ) : previewError ? (
              <p className="text-sm text-destructive">{previewError}</p>
            ) : null}
          </>
        )}

        {step === 2 && (
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
                  <Textarea id="notes" placeholder="Add notes…" {...field} />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo</Label>
                  <input
                    ref={fileInputRef}
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      field.onChange(file);
                      setPhotoPreview(file ? URL.createObjectURL(file) : null);
                    }}
                  />
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Selected photo"
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  ) : null}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {field.value ? "Change Photo" : "Upload Photo"}
                  </Button>
                </div>
              )}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Nickname:</span> {form.getValues("nickname")}</p>
            <p><span className="font-medium">Species:</span> {form.getValues("species")}</p>
            {form.getValues("room_id") != null && (
              <p><span className="font-medium">Room:</span> {form.getValues("room_id")}</p>
            )}
            {form.getValues("pot") && (
              <p><span className="font-medium">Pot:</span> {form.getValues("pot")}</p>
            )}
            {form.getValues("light") && (
              <p><span className="font-medium">Light:</span> {form.getValues("light")}</p>
            )}
            {form.getValues("notes") && (
              <p><span className="font-medium">Notes:</span> {form.getValues("notes")}</p>
            )}
          </div>
        )}

        {errorMsg ? (
          <p className="text-sm text-destructive">{errorMsg}</p>
        ) : null}

        <div className="flex justify-between">
          <div className="flex gap-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
          {step < totalSteps ? (
            <Button type="button" className="ml-auto" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="ml-auto"
              disabled={submitting || !form.formState.isValid}
            >
              {submitting ? "Creating…" : "Create Plant"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
