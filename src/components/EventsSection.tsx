'use client';

import { useState } from 'react';
import type { CareEvent } from '@/types';
import AddNoteForm from './AddNoteForm';
import AddPhotoForm from './AddPhotoForm';
import CareTimeline from './CareTimeline';

interface Props {
  plantId: string;
  initialEvents: CareEvent[];
}

export default function EventsSection({ plantId, initialEvents }: Props) {
  const [events, setEvents] = useState<CareEvent[]>(initialEvents);

  function addEvent(evt: CareEvent) {
    setEvents((prev) => [evt, ...prev]);
  }

  function replaceEvent(tempId: string, evt: CareEvent) {
    setEvents((prev) => prev.map((e) => (e.id === tempId ? evt : e)));
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Add Note</h2>
      <AddNoteForm plantId={plantId} onAdd={addEvent} onReplace={replaceEvent} />
      <h2 className="mb-4 mt-8 text-xl font-semibold">Upload Photo</h2>
      <AddPhotoForm plantId={plantId} onAdd={addEvent} onReplace={replaceEvent} />
      <h2 className="mb-4 mt-8 text-xl font-semibold">Timeline</h2>
      <CareTimeline events={events} />
    </div>
  );
}
