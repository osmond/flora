import { describe, it, expect, beforeEach, vi } from 'vitest';
import { queueEvent, flushQueue, QUEUE_KEY } from '../src/lib/offlineQueue';

describe('offlineQueue', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it('queues payloads and flushes when online', async () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      configurable: true,
    });
    const payload = { plant_id: '1', type: 'note', note: 'hi' };
    queueEvent(payload);
    expect(JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]')).toHaveLength(1);

    Object.defineProperty(window.navigator, 'onLine', {
      value: true,
      configurable: true,
    });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const dispatchMock = vi.fn();
    window.dispatchEvent = dispatchMock as any;

    await flushQueue();

    expect(fetchMock).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalled();
    expect(localStorage.getItem(QUEUE_KEY)).toBe('[]');
  });
});
