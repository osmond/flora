import Image from 'next/image';
import db from '@/lib/db';

export default async function PhotoGallery({ plantId }: { plantId: string }) {
  const photos = await db.photo.findMany({
    where: { plantId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, url: true },
  });

  if (photos.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo: { id: string; url: string | null }) => (
        <Image
          key={photo.id}
          src={photo.url ?? ''}
          alt="Photo of plant"
          width={300}
          height={300}
          className="h-32 w-full rounded-lg object-cover"
        />
      ))}
    </div>
  );
}
