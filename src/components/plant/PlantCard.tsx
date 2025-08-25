import Image from 'next/image';
import Link from 'next/link';

interface Plant {
  id: string;
  nickname: string;
  speciesScientific?: string | null;
  speciesCommon?: string | null;
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
          alt={plant.nickname}
          width={400}
          height={300}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="h-40 w-full bg-muted" />
      )}
      <div className="p-2">
        <h3 className="font-semibold">{plant.nickname}</h3>
        {(plant.speciesScientific || plant.speciesCommon) && (
          <p className="text-sm text-muted-foreground">
            {plant.speciesScientific || plant.speciesCommon}
          </p>
        )}
      </div>
    </Link>
  );
}

