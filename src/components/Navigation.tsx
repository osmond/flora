"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Sprout, BarChart, Plus } from 'lucide-react';

const links = [
  { href: '/', label: 'Today', Icon: Calendar },
  { href: '/plants', label: 'Plants', Icon: Sprout },
  { href: '/stats', label: 'Stats', Icon: BarChart },
  { href: '/add', label: 'Add', Icon: Plus },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-4 text-sm md:text-base">
        {links.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-2 rounded px-4 py-2 transition-colors duration-200 ease-out motion-reduce:transition-none hover:bg-accent ${
                  isActive ? "bg-accent text-accent-foreground font-semibold" : ""
                }`}
              >
                <Icon strokeWidth={1.5} className="h-4 w-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
