'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SpeciesAutosuggest from "./SpeciesAutosuggest";

export default function AddPlantForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [speciesScientific, setSpeciesScientific] = useState("");
  const [speciesCommon, setSpeciesCommon] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          speciesScientific,
          speciesCommon,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create plant");
      const id = json?.plant?.id;
      if (id) router.push(`/plants/${id}`);
      else router.push(`/plants`);
    } catch (e: any) {
      setErr(e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="e.g. Kay"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Species</Label>
            <SpeciesAutosuggest
              value={speciesCommon || speciesScientific}
              onSelect={(scientific: string, common?: string) => {
                setSpeciesScientific(scientific);
                setSpeciesCommon(common);
              }}
            />
          </div>

          {err ? <p className="text-sm text-destructive">{err}</p> : null}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating…" : "Create Plant"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
