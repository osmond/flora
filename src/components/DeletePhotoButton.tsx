"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { TrashIcon } from "lucide-react";

export default function DeletePhotoButton({
  eventId,
}: {
  eventId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Delete this photo?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={loading}
        aria-label="Delete photo"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

