import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CareNudge from '../src/components/CareNudge';

(globalThis as unknown as { React: typeof React }).React = React;


describe('CareNudge', () => {
  it('posts feedback when applying suggestion', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ suggestions: ['Test nudge'] }) })
      .mockResolvedValue({ ok: true, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<CareNudge plantId="plant-1" />);

    await screen.findByText('Test nudge');

    await fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/care-feedback',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ plant_id: 'plant-1', feedback: 'applied' }),
        })
      );
    });
  });

  it('posts feedback when dismissing suggestion', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ suggestions: ['Another nudge'] }) })
      .mockResolvedValue({ ok: true, json: async () => ({}) });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<CareNudge plantId="plant-2" />);

    await screen.findByText('Another nudge');

    await fireEvent.click(screen.getByText('Dismiss'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/care-feedback',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ plant_id: 'plant-2', feedback: 'dismissed' }),
        })
      );
    });
  });
});

