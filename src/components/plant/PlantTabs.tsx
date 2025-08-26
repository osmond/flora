'use client';

import { useState, useEffect } from 'react';
import type { CareEvent } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CareTimeline from '@/components/CareTimeline';
import AddNoteForm from '@/components/AddNoteForm';
import AddPhotoForm from '@/components/AddPhotoForm';
import PhotoGalleryClient from './PhotoGalleryClient';
import { EventQuickAdd } from './EventQuickAdd';
import { hydrateTimeline } from '@/lib/tasks';

interface PlantTabsProps {
  plantId: string;
  initialEvents: CareEvent[];
  waterEvery?: string | null;
  fertEvery?: string | null;
  timelineError?: boolean;
}

export default function PlantTabs({
  plantId,
  initialEvents,
  waterEvery,
  fertEvery,
  timelineError = false,
}: PlantTabsProps) {
  const [events, setEvents] = useState<CareEvent[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as { plantId?: string };
      if (detail?.plantId !== plantId) return;
      refresh();
    }
    window.addEventListener('flora:events:changed', handler as EventListener);
    return () => window.removeEventListener('flora:events:changed', handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plantId, waterEvery, fertEvery]);

  async function refresh() {
    try {
      const res = await fetch(`/api/events?plantId=${plantId}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const data: CareEvent[] = await res.json();
      setEvents(hydrateTimeline(data, { id: plantId, waterEvery, fertEvery }));
    } catch (err) {
      console.error(err);
    }
  }

  function addEvent(evt: CareEvent) {
    setEvents((prev) => [evt, ...prev]);
  }

  function replaceEvent(tempId: string, evt: CareEvent) {
    setEvents((prev) => prev.map((e) => (e.id === tempId ? evt : e)));
  }

  const noteEvents = events.filter((e) => e.type === 'note');

  return (
    <Tabs defaultValue="timeline" className="mt-8">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="care">Care Plan</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="timeline" className="mt-6 space-y-4">
        <EventQuickAdd plantId={plantId} />
        <CareTimeline events={events} error={timelineError} />
      </TabsContent>
      <TabsContent value="care" className="mt-6">
        <p className="text-sm text-muted-foreground">Care plan coming soon.</p>
      </TabsContent>
      <TabsContent value="photos" className="mt-6 space-y-4">
        <AddPhotoForm plantId={plantId} onAdd={addEvent} onReplace={replaceEvent} />
        <PhotoGalleryClient events={events} />
      </TabsContent>
      <TabsContent value="notes" className="mt-6 space-y-4">
        <AddNoteForm plantId={plantId} onAdd={addEvent} onReplace={replaceEvent} />
        {noteEvents.length > 0 ? (
          <ul className="space-y-4">
            {noteEvents.map((evt) => (
              <li key={evt.id} className="rounded-md border p-4">
                <p className="text-sm">{evt.note}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(evt.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No notes yet.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}

