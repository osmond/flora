"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function AddPlantForm(): JSX.Element {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>("");
  const [speciesScientific, setSpeciesScientific] = useState<string>("");
  const [speciesCommon, setSpeciesCommon] = useState<string>("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [pot, setPot] = useState<string>("");
  const [light, setLight] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [_photoFile, setPhotoFile] = useState<File | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [carePreview, setCarePreview] = useState<string | null>(null);
  const [_previewing, setPreviewing] = useState<boolean>(false);

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload: CreatePayload = {
        nickname: nickname.trim(),
        speciesScientific: speciesScientific || null,
        speciesCommon: speciesCommon || null,
        room_id: roomId,
        pot: pot.trim() || null,
        light: light.trim() || null,
        notes: notes.trim() || null,
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

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          placeholder="e.g. Kay"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
          className="h-10"
        />
      </div>

      <div className="space-y-2">
        <Label>Species</Label>
        <SpeciesAutosuggest
          value={speciesCommon || speciesScientific}
          onSelect={(scientific, common) => {
            setSpeciesScientific(scientific);
            setSpeciesCommon(common || "");
            fetchPreview(scientific, common);
          }}
        />
      </div>

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
            <RoomSelect id="room" value={roomId ?? null} onChange={setRoomId} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pot">Pot</Label>
            <Input
              id="pot"
              placeholder='e.g. 4" terracotta'
              value={pot}
              onChange={(e) => setPot(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="light">Light</Label>
            <Input
              id="light"
              placeholder="e.g. Bright indirect"
              value={light}
              onChange={(e) => setLight(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              placeholder="Add notes…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="h-10"
            />
          </div>
        </div>
      )}

      {errorMsg ? (
        <p className="text-sm text-destructive">{errorMsg}</p>
      ) : null}

      <Button type="submit" className="w-full h-10" disabled={submitting}>
        {submitting ? "Creating…" : "Create Plant"}
      </Button>
    </form>
  );
}
