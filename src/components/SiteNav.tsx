"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Leaf, Calendar } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

(globalThis as unknown as { React?: typeof React }).React ??= React;

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/plants", label: "Plants", icon: Leaf },
  { href: "/today", label: "Today", icon: Calendar },
];

export default function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <div className="hidden md:block px-4 md:px-6">
        <NavigationMenu>
          <NavigationMenuList>
            {links.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={href}
                    aria-current={isActive(href) ? "page" : undefined}
                    className={cn(
                      "px-3 py-2 text-sm font-medium hover:text-primary",
                      isActive(href) ? "text-primary" : ""
                    )}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-20 flex justify-around border-t bg-background py-2 md:hidden">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive(href) ? "page" : undefined}
            className="flex flex-col items-center text-xs"
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isActive(href) ? "text-primary" : "text-muted-foreground"
              )}
            />
          </Link>
        ))}
      </nav>
    </>
  );
}
