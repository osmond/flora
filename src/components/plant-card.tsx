import { Card, CardContent } from "@/components/ui";
import { ImageIcon, Droplets } from "lucide-react";

export function PlantCard({name, species, room, next}:{name:string; species:string; room:string; next:string;}) {
  return (
    <Card className="transition hover:shadow-md rounded-2xl">
      <div className="aspect-[4/3] w-full border-b grid place-items-center text-muted-foreground">
        <ImageIcon className="h-4 w-4" />
      </div>
      <CardContent className="p-4 space-y-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{species} · {room}</div>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
          <Droplets className="h-4 w-4" /> Water in {next}
        </div>
      </CardContent>
    </Card>
  );
}
