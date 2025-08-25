import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';

(globalThis as unknown as { React: typeof React }).React = React;

process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.com';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';

vi.mock('@/lib/auth', () => ({
  getCurrentUserId: () => Promise.resolve('user-123'),
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

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
    }),
  }),
}));

describe('PlantsPage', () => {
  it('shows a friendly empty state when there are no plants', async () => {
    const PlantsPage = (await import('../src/app/plants/page')).default;
    const element = await PlantsPage();
    const html = renderToString(element);
    expect(html).toContain('Add your first plant');
  });
});

