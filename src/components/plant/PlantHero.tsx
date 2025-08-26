import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PlantHeroProps {
  plant: {
    id: string;
    nickname: string;
    speciesScientific?: string | null;
    speciesCommon?: string | null;
    room?: { name: string | null } | null;
  };
  heroUrl: string | null;
}

export default function PlantHero({ plant, heroUrl }: PlantHeroProps) {
  const species = plant.speciesScientific || plant.speciesCommon;
  return (
    <div className="relative w-full overflow-hidden rounded-xl aspect-video">
      {heroUrl ? (
        <Image src={heroUrl} alt={plant.nickname} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        <div className="text-white drop-shadow">
          <h2 className="text-xl font-semibold">{plant.nickname}</h2>
          {species && <p className="text-sm text-white/80">{species}</p>}
        </div>
        <div className="flex items-center gap-2">
          {plant.room?.name && (
            <Badge className="bg-white/20 text-white backdrop-blur-sm" variant="secondary">
              {plant.room.name}
            </Badge>
          )}
          <Link href={`/plants/${plant.id}/edit`}>
            <Button variant="outline" size="sm" className="bg-white/20 text-white hover:bg-white/30">
              Edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
