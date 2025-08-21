"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { ImagePlus } from "lucide-react";

export default function AddPhotoForm({ plantId }: { plantId: string }) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) return;

    const formData = new FormData();
    formData.append("plant_id", plantId);
    formData.append("type", "photo");
    formData.append("photo", photo);
    if (note) formData.append("note", note);

    await fetch("/api/events", {
      method: "POST",
      body: formData,
    });

    setPhoto(null);
    setNote("");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
      />
      <Input
        type="text"
        placeholder="Caption (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit" className="flex items-center gap-2">
        <ImagePlus strokeWidth={1.5} className="h-4 w-4" />
        Add Photo
      </Button>
    </form>
  );
}
