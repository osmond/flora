import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // Ensure attribute matches server-rendered HTML to avoid hydration warnings
    <html lang="en" data-google-analytics-opt-out="">
      <body>{children}</body>
    </html>
  );
}
