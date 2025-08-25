'use client';

import { useState, useEffect } from 'react';
import type { CareEvent } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CareTimeline from '@/components/CareTimeline';
import AddNoteForm from '@/components/AddNoteForm';
import AddPhotoForm from '@/components/AddPhotoForm';
import PhotoGalleryClient from './PhotoGalleryClient';
import { EventQuickAdd } from './EventQuickAdd';

interface PlantTabsProps {
  plantId: string;
  initialEvents: CareEvent[];
  timelineError?: boolean;
}

export default function PlantTabs({
  plantId,
  initialEvents,
  timelineError = false,
}: PlantTabsProps) {
  const [events, setEvents] = useState<CareEvent[]>(initialEvents);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

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

