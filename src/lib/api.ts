'use client';

import { toast } from 'sonner';

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      if (data && typeof data.error === 'string') {
        message = data.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    if (res.status === 401 || res.status === 403) {
      message = 'You do not have permission to perform this action';
    }
    if (typeof window !== 'undefined') {
      toast.error(message);
    }
    throw new Error(message);
  }
  return (res.json() as Promise<T>);
}
