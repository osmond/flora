import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BackupControls from '../src/components/BackupControls';

(globalThis as any).React = React;
(HTMLAnchorElement.prototype as any).click = vi.fn();

describe('BackupControls', () => {
  it('requests export on download', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ plants: [], events: [] }),
    });
    global.fetch = fetchMock as any;
    (global.URL as any).createObjectURL = vi.fn(() => 'blob:mock');
    (global.URL as any).revokeObjectURL = vi.fn();

    render(<BackupControls />);
    const btn = screen.getByText('Download Backup');
    await fireEvent.click(btn);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/export');
    });
  });
});
