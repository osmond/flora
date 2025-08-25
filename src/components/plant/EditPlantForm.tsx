"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Plant = {
  id: string;
  nickname: string;
  speciesScientific: string | null;
  imageUrl: string | null;
};

export default function EditPlantForm({ plant }: { plant: Plant }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(plant.nickname);
  const [speciesScientific, setSpeciesScientific] = useState(plant.speciesScientific ?? "");
  const [imageUrl, setImageUrl] = useState(plant.imageUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          species_scientific: speciesScientific.trim() || null,
          image_url: imageUrl.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      router.push(`/plants/${plant.id}`);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onArchive() {
    if (!confirm("Archive this plant?")) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Archive failed");
      router.push("/");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Archive failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this plant? This cannot be undone.")) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/plants/${plant.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      router.push("/");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="nickname">Nickname</Label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="speciesScientific">Species</Label>
        <Input
          id="speciesScientific"
          value={speciesScientific}
          onChange={(e) => setSpeciesScientific(e.target.value)}
          className="h-10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="imageUrl">Photo URL</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="h-10"
        />
      </div>
      {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
      <div className="space-y-3">
        <Button type="submit" className="w-full h-10" disabled={submitting}>
          {submitting ? "Saving…" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="w-full h-10"
          onClick={onArchive}
          disabled={submitting}
        >
          Archive Plant
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full h-10 text-destructive border-destructive"
          onClick={onDelete}
          disabled={submitting}
        >
          Delete Plant
        </Button>
      </div>
    </form>
  );
}

