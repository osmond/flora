import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        <Providers>
          <Toaster />
          <header className="flex items-center justify-between p-4">
            <Navigation />
            <ThemeToggle />
          </header>
          <main className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
