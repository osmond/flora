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

let pathname = '/today';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

describe('Navigation', () => {
  it('renders links to all sections', () => {
    const html = renderToString(<Navigation />);
    expect(html).toContain('href="/today"');
    expect(html).toContain('href="/plants"');
    expect(html).toContain('href="/add"');
  });

  it('highlights the active route', () => {
    pathname = '/plants';
    const html = renderToString(<Navigation />);
    expect(html).toMatch(/href="\/plants"[^>]*aria-current="page"/);
  });
});
