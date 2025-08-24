import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/plants", label: "Plants" },
    { href: "/add", label: "Add" },
  ];
  return (
    <nav>
      {links.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
