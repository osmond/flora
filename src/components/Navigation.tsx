'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <nav aria-label="Main" className="flex gap-4">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
