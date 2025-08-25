import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import Navigation from '../src/components/Navigation';

// Mock next/link to render a simple anchor
vi.mock('next/link', () => ({
  default: (
    { href, children, ...props }: { href: string; children: React.ReactNode } & Record<string, unknown>,
  ) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

let pathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: () => {} }),
}));

describe('Navigation', () => {
  it('renders links to all sections', () => {
    const html = renderToString(<Navigation />);
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/plants"');
    expect(html).toContain('href="/dashboard"');
    expect(html).toContain('href="/plants/new"');
  });

  it('highlights the active route', () => {
    pathname = '/plants';
    const html = renderToString(<Navigation />);
    expect(html).toMatch(/href="\/plants"[^>]*aria-current="page"/);
  });

  it('highlights nested routes', () => {
    pathname = '/plants/123';
    const html = renderToString(<Navigation />);
    expect(html).toMatch(/href="\/plants"[^>]*aria-current="page"/);
  });

  it('only highlights home on the root path', () => {
    pathname = '/';
    const rootHtml = renderToString(<Navigation />);
    expect(rootHtml).toMatch(/href="\/"[^>]*aria-current="page"/);

    pathname = '/plants';
    const plantsHtml = renderToString(<Navigation />);
    expect(plantsHtml).not.toMatch(/href="\/"[^>]*aria-current="page"/);
  });

  it('renders theme toggle button', () => {
    const html = renderToString(<Navigation />);
    expect(html).toContain('Toggle theme');
  });
});
