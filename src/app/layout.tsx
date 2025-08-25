import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-google-analytics-opt-out="">
      <body>{children}</body>
    </html>
  );
}
