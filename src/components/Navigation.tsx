'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

// Ensure React is available when components are rendered in tests
(globalThis as unknown as { React?: typeof React }).React ??= React;

interface NavLink {
  href: string;
  label: string;
}

const links: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/plants', label: 'Plants' },
  { href: '/add', label: 'Add' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <nav aria-label="Main" className="flex gap-4">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
          {label}
        </Link>
      ))}
      <button
        type="button"
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary"
      >
        Toggle theme
      </button>
    </nav>
  );
}
