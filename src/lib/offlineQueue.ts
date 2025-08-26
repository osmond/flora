const QUEUE_KEY = 'flora:offline-events';

export type EventPayload = {
  plant_id: string;
  type: string;
  note?: string;
  amount?: number;
};

function getQueue(): EventPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as EventPayload[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: EventPayload[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(
      new CustomEvent('flora:queue:changed', {
        detail: { length: queue.length },
      }),
    );
  } catch {
    // ignore
  }
}

export function getQueueLength() {
  return getQueue().length;
}

export async function flushQueue() {
  const queue = getQueue();
  if (queue.length === 0) return;
  const remaining: EventPayload[] = [];
  for (const payload of queue) {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        window.dispatchEvent(
          new CustomEvent('flora:events:changed', {
            detail: { plantId: payload.plant_id },
          })
        );
      } else {
        remaining.push(payload);
      }
    } catch {
      remaining.push(payload);
    }
  }
  saveQueue(remaining);
}

let started = false;
export function startQueue() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('online', flushQueue);
  if (navigator.onLine) {
    flushQueue();
  }
}

export function queueEvent(payload: EventPayload) {
  const queue = getQueue();
  queue.push(payload);
  saveQueue(queue);
  startQueue();
}

export { QUEUE_KEY };
