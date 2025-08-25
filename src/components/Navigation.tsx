'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

// Ensure React is available when components are rendered in tests
(globalThis as unknown as { React?: typeof React }).React ??= React;

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/plants', label: 'Plants' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/plants/new', label: 'Add' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav aria-label="Main" className="flex gap-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={
            href === '/' ? (pathname === '/' ? 'page' : undefined) : pathname.startsWith(href) ? 'page' : undefined
          }
        >
          {label}
        </Link>
      ))}
      <Button
        type="button"
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        variant="ghost"
      >
        Toggle theme
      </Button>
    </nav>
  );
}
