"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SpeciesAutosuggest from "@/components/plant/SpeciesAutosuggest";
import { RoomSelect } from "@/components/plant/RoomSelect";
import { toast } from "sonner";

export default function QuickAddDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [nickname, setNickname] = React.useState("");
  const [species, setSpecies] = React.useState("");
  const [speciesScientific, setSpeciesScientific] = React.useState("");
  const [speciesCommon, setSpeciesCommon] = React.useState("");
  const [roomId, setRoomId] = React.useState<number | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nickname.trim()) {
      toast.error("Please enter a nickname");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          speciesScientific: speciesScientific || species || null,
          speciesCommon: speciesCommon || species || null,
          room_id: roomId,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error || "Failed to add plant");
        return;
      }
      toast.success("Plant added");
      setOpen(false);
      setNickname("");
      setSpecies("");
      setSpeciesScientific("");
      setSpeciesCommon("");
      setRoomId(null);
      const id = json?.plant?.id;
      if (id) router.push(`/plants/${id}`);
      else router.refresh();
    } catch {
      toast.error("Failed to add plant");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add Plant</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Add Plant</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Monstera" />
          </div>
          <div className="space-y-2">
            <Label>Species (optional)</Label>
            <SpeciesAutosuggest
              value={species}
              onSelect={(scientific, common) => {
                setSpeciesScientific(scientific);
                setSpeciesCommon(common || "");
                setSpecies(common || scientific);
              }}
              onInputChange={(val) => {
                setSpecies(val);
                setSpeciesScientific("");
                setSpeciesCommon("");
              }}
              placeholder="Search species…"
            />
          </div>
          <RoomSelect id="room" value={roomId} onChange={setRoomId} />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>{submitting ? "Adding…" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

