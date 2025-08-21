"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Today' },
  { href: '/plants', label: 'Plants' },
  { href: '/stats', label: 'Stats' },
  { href: '/add', label: 'Add' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-4 text-sm md:text-base">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded px-4 py-2 transition-colors duration-200 ease-out motion-reduce:transition-none hover:bg-accent ${
                  isActive ? "bg-accent text-accent-foreground font-semibold" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
