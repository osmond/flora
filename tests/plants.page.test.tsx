import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderToString } from 'react-dom/server';

(globalThis as unknown as { React: typeof React }).React = React;

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

const getCurrentUserId = vi.fn();
vi.mock('@/lib/auth', () => ({
  getCurrentUserId,
}));

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ComponentProps<'img'>) => <img {...props} alt={props.alt ?? ''} />,
}));

vi.mock('@/components', () => ({
  PlantCard: () => null,
}));

const eq = vi.fn().mockResolvedValue({ data: [], error: null });
const select = vi.fn().mockReturnValue({ eq });
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ select }),
  }),
}));

beforeEach(() => {
  vi.resetModules();
  getCurrentUserId.mockReset();
  eq.mockReset();
});

describe('PlantsPage', () => {
  it('shows a friendly empty state when there are no plants', async () => {
    getCurrentUserId.mockReturnValue('user-123');
    eq.mockResolvedValue({ data: [], error: null });

    const PlantsPage = (await import('../src/app/plants/page')).default;
    const element = await PlantsPage();
    const html = renderToString(element);
    expect(eq).toHaveBeenCalledWith('user_id', 'user-123');
    expect(html).toContain('Add your first plant');
  });

  it('shows a message when the user is not authenticated', async () => {
    getCurrentUserId.mockImplementation(() => {
      throw new Error('Unauthorized');
    });

    const PlantsPage = (await import('../src/app/plants/page')).default;
    const element = await PlantsPage();
    const html = renderToString(element);
    expect(html).toContain('Please sign in to view your plants.');
  });
});

