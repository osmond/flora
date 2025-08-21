import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import ThemeToggle from "@/components/ThemeToggle";
import Navigation from "@/components/Navigation";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cabinet = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cabinet",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cabinet.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <Providers>
          <Toaster />
          <header className="flex items-center justify-between p-4">
            <Navigation />
            <ThemeToggle />
          </header>
          <main className="mx-auto max-w-screen-md p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
