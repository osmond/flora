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
};

export default function AddPlantForm(): JSX.Element {
  const router = useRouter();
  const [nickname, setNickname] = useState<string>("");
  const [speciesScientific, setSpeciesScientific] = useState<string>("");
  const [speciesCommon, setSpeciesCommon] = useState<string>("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
          }}
        />
      </div>

      <div className="space-y-2">
        <Label>Room</Label>
        <RoomSelect value={roomId ?? null} onChange={setRoomId} />
      </div>

      {errorMsg ? (
        <p className="text-sm text-destructive">{errorMsg}</p>
      ) : null}

      <Button type="submit" className="w-full h-10" disabled={submitting}>
        {submitting ? "Creating…" : "Create Plant"}
      </Button>
    </form>
  );
}
