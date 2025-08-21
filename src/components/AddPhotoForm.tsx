"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-700"
      />
      <input
        type="text"
        placeholder="Caption (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
      >
        Add Photo
      </button>
    </form>
  );
}
