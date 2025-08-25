'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
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
  const [open, setOpen] = React.useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        variant="ghost"
        className="md:hidden self-end"
        aria-label="Toggle menu"
        aria-controls="primary-navigation"
        aria-expanded={open}
        onClick={toggleMenu}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
      >
        Menu
      </Button>
      <NavigationMenu.Root
        id="primary-navigation"
        aria-label="Main"
        className={`${open ? 'block' : 'hidden'} md:block`}
      >
        <NavigationMenu.List className="flex flex-col gap-4 md:flex-row">
          {links.map(({ href, label }) => (
            <NavigationMenu.Item key={href}>
              <NavigationMenu.Link asChild>
                <Link
                  href={href}
                  aria-current={
                    href === '/'
                      ? pathname === '/' ? 'page' : undefined
                      : pathname.startsWith(href)
                        ? 'page'
                        : undefined
                  }
                >
                  {label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
          <NavigationMenu.Item>
            <Button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              variant="ghost"
            >
              Toggle theme
            </Button>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}

