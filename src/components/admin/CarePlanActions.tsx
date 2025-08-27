"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CarePlanActions() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function run(url: string, label: string) {
    setBusy(true);
    try {
      const res = await fetch(url, { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        toast.error(`${label} failed: ${json?.error || res.statusText}`);
        return false;
      } else {
        const detail = json?.updated ?? json?.inserted ?? "ok";
        toast.success(`${label} complete: ${detail}`);
        return true;
      }
    } catch (e) {
      toast.error(`${label} failed`);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function runAll() {
    if (busy) return;
    setBusy(true);
    try {
      const okPlans = await run("/api/care-plans/generate", "Generate care plans");
      if (!okPlans) return;
      const okTasks = await run("/api/tasks/generate", "Generate tasks");
      if (!okTasks) return;
      toast.success("All set — redirecting to Today");
      router.push("/today");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={busy} onClick={runAll}>
        Generate all
      </Button>
      <Button
        size="sm"
        variant="secondary"
        disabled={busy}
        onClick={() => run("/api/care-plans/generate", "Generate care plans")}
      >
        Generate care plans
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() => run("/api/tasks/generate", "Generate tasks")}
      >
        Generate tasks
      </Button>
    </div>
  );
}
