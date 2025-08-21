import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import ToasterProvider from "@/components/ToasterProvider";
import ThemeToggle from "@/components/ThemeToggle";
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-dvh bg-green-50 text-gray-900 antialiased dark:bg-gray-900`}
      >
        <Providers>
          <ToasterProvider />
          <header className="flex items-center justify-between p-4 text-gray-900 dark:text-gray-100">
            <Navigation />
            <ThemeToggle />
          </header>
          <main className="mx-auto max-w-screen-md p-4 text-gray-900 dark:text-gray-100">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
