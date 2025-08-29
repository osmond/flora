"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDangerPanel() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function resetDb() {
    if (busy) return;
    if (!confirm("This will remove all plants, events, and tasks. Continue?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset-db", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        toast.error(json?.error || "Reset failed");
        return;
      }
      toast.success("Database reset complete");
      router.refresh();
    } catch {
      toast.error("Reset failed");
    } finally {
      setBusy(false);
    }
  }

  async function resetAndSeed() {
    if (busy) return;
    if (!confirm("This will RESET the DB and SEED demo plants. Continue?")) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/reset-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: true }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.ok === false) {
        toast.error(json?.error || "Reset & seed failed");
        return;
      }
      toast.success(`Database reset and seeded (${json?.seeded ?? 0} plants)`);
      router.refresh();
    } catch {
      toast.error("Reset & seed failed");
    } finally {
      setBusy(false);
    }
  }

  if (process.env.NEXT_PUBLIC_ADMIN_MODE !== "1" && process.env.ADMIN_MODE !== "1") return null;

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
      <div className="mb-2 text-sm font-medium">Danger Zone</div>
      <p className="mb-3 text-xs text-muted-foreground">Reset the database to a clean slate (plants, events, tasks). Rooms are preserved or created.</p>
      <div className="flex gap-2">
        <Button variant="destructive" size="sm" disabled={busy} onClick={resetDb}>
          {busy ? "Resetting…" : "Reset DB (dev)"}
        </Button>
        <Button variant="secondary" size="sm" disabled={busy} onClick={resetAndSeed}>
          {busy ? "Working…" : "Reset & Seed Demo"}
        </Button>
      </div>
    </div>
  );
}
