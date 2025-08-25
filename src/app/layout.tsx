import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
