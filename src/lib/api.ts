'use client';

import { toast } from 'sonner';
import { supabaseClient } from '@/lib/supabase/client';

export async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const userId = session?.user?.id;
  const headers = new Headers(init?.headers);
  if (userId) {
    headers.set('x-user-id', userId);
  }
  const res = await fetch(input, { ...init, headers });
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
