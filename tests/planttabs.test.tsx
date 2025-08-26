import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PlantTabs from '../src/components/plant/PlantTabs';

(globalThis as unknown as { React: typeof React }).React = React;

vi.mock('../src/components/plant/EventQuickAdd', () => ({ EventQuickAdd: () => null }));
vi.mock('../src/components/AddNoteForm', () => ({ default: () => null }));
vi.mock('../src/components/AddPhotoForm', () => ({ default: () => null }));
vi.mock('../src/components/plant/PhotoGalleryClient', () => ({ default: () => null }));
vi.mock('../src/components/CareTimeline', () => ({ default: () => null }));
vi.mock('../src/components/ui/tabs', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('PlantTabs', () => {
  it('refetches events when flora:events:changed fires', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    const spy = vi.spyOn(global, 'fetch').mockImplementation(fetchMock as any);

    render(<PlantTabs plantId="p1" initialEvents={[]} waterEvery="7 days" fertEvery={null} />);

    window.dispatchEvent(
      new CustomEvent('flora:events:changed', { detail: { plantId: 'p1' } })
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/events?plantId=p1');
    });

    spy.mockRestore();
  });
});
