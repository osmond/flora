import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import SiteNav from "@/components/SiteNav";
import LocationProvider from "@/components/LocationProvider";
import OfflineQueueProvider from "@/components/OfflineQueueProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"
        />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LocationProvider />
          <OfflineQueueProvider />
          <SiteNav />
          {/* Full-width flow again (keep some padding) */}
          <main className="flex-1 px-4 py-6 md:px-6">{children}</main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
