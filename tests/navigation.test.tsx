import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SiteNav from '../src/components/SiteNav';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

let pathname = '/';
vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

describe('SiteNav', () => {
  it('renders links to all sections', () => {
    render(<SiteNav />);
    expect(screen.getAllByRole('link', { name: 'Home' })[0]).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: 'Plants' })[0]).toHaveAttribute('href', '/plants');
    expect(screen.getAllByRole('link', { name: 'Today' })[0]).toHaveAttribute('href', '/today');
  });

  it('highlights the active route', () => {
    pathname = '/plants';
    render(<SiteNav />);
    expect(screen.getAllByRole('link', { name: 'Plants' })[0]).toHaveAttribute('aria-current', 'page');
    pathname = '/';
  });
});
