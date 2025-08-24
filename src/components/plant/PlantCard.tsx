import Image from 'next/image';
import Link from 'next/link';

interface Plant {
  id: string;
  name: string;
  species?: string | null;
  imageUrl?: string | null;
}

export default function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link
      href={`/plants/${plant.id}`}
      className="block overflow-hidden rounded-lg border"
    >
      {plant.imageUrl ? (
        <Image
          src={plant.imageUrl}
          alt={plant.name}
          width={400}
          height={300}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-muted" />
      )}
      <div className="p-2">
        <h3 className="font-semibold">{plant.name}</h3>
        {plant.species && (
          <p className="text-sm text-muted-foreground">{plant.species}</p>
        )}
      </div>
    </Link>
  );
}

