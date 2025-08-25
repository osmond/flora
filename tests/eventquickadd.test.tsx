import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventQuickAdd } from '../src/components/plant/EventQuickAdd';

(globalThis as unknown as { React: typeof React }).React = React;

describe('EventQuickAdd', () => {
  it('posts water event with plant_id', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    const spy = vi.spyOn(global, 'fetch').mockImplementation(fetchMock as any);
    const dispatchMock = vi.fn();
    window.dispatchEvent = dispatchMock as any;

    render(<EventQuickAdd plantId="123" />);
    await fireEvent.click(screen.getByText('Watered'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/events',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ plant_id: '123', type: 'water' }),
        }),
      );
    });
    expect(dispatchMock).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('sends note text when adding note', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    const spy = vi.spyOn(global, 'fetch').mockImplementation(fetchMock as any);

    render(<EventQuickAdd plantId="123" />);
    fireEvent.change(screen.getByPlaceholderText('Quick note…'), {
      target: { value: 'hello' },
    });
    await fireEvent.click(screen.getByText('Add note'));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenLastCalledWith(
        '/api/events',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ plant_id: '123', type: 'note', note: 'hello' }),
        }),
      );
    });
    spy.mockRestore();
  });
});
