"use client";

import Image from 'next/image';
import { format } from 'date-fns';
import type { CareEvent } from '@/types';

export default function CareTimeline({ events }: { events: CareEvent[] }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-muted-foreground">No care events yet.</p>;
  }

  const grouped = events.reduce<Record<string, CareEvent[]>>((acc, evt) => {
    const day = format(new Date(evt.created_at), 'PPP');
    if (!acc[day]) acc[day] = [];
    acc[day].push(evt);
    return acc;
  }, {});

  return (
    <ul className="space-y-8">
      {Object.entries(grouped).map(([day, dayEvents]) => (
        <li key={day}>
          <div className="mb-2 text-sm font-medium text-muted-foreground">{day}</div>
            <ul className="space-y-6 border-l pl-6">
              {dayEvents.map((evt: CareEvent) => (
              <li key={evt.id} className="relative">{
                /* timeline dot */
              }
                <span className="absolute -left-3 top-2 h-2 w-2 rounded-full bg-primary" />
                {evt.type === 'photo' && evt.image_url ? (
                  <Image
                    src={evt.image_url}
                    alt={evt.note ?? evt.type}
                    width={300}
                    height={200}
                    className="rounded-md"
                  />
                ) : (
                  <p className="font-medium capitalize">{evt.type}</p>
                )}
                {evt.note && (
                  <p className="text-sm text-muted-foreground">{evt.note}</p>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

