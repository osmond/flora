import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navigation from '../src/components/Navigation';

// Mock next/link to render a simple anchor
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

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: () => {} }),
}));

describe('Navigation', () => {
  it('renders links to all sections', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Plants' })).toHaveAttribute('href', '/plants');
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: 'Add' })).toHaveAttribute('href', '/plants/new');
  });

  it('highlights the active route', () => {
    pathname = '/plants';
    render(<Navigation />);
    expect(screen.getByRole('link', { name: 'Plants' })).toHaveAttribute('aria-current', 'page');
    pathname = '/';
  });

  it('toggles menu visibility', async () => {
    render(<Navigation />);
    const toggle = screen.getByRole('button', { name: /toggle menu/i });
    const menu = screen.getByRole('navigation', { name: 'Main' });

    expect(menu.classList.contains('hidden')).toBe(true);
    await fireEvent.click(toggle);
    expect(menu.classList.contains('hidden')).toBe(false);
  });

  it('renders theme toggle button', () => {
    render(<Navigation />);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });
});

