import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import ToasterProvider from "@/components/ToasterProvider";
import ThemeToggle from "@/components/ThemeToggle";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-dvh bg-green-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100`}
      >
        <Providers>
          <ToasterProvider />
          <header className="flex justify-end p-4">
            <ThemeToggle />
          </header>
          <main className="mx-auto max-w-screen-md p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
