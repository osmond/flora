'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddPhotoForm({ plantId }: { plantId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('plant_id', plantId);
    formData.append('type', 'photo');
    formData.append('photo', file);
    await fetch('/api/events', {
      method: 'POST',
      body: formData,
    });
    setFile(null);
    (e.target as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <button
        type="submit"
        className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
      >
        Upload Photo
      </button>
    </form>
  );
}
