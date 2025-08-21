import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import ToasterProvider from "@/components/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-dvh bg-green-50 text-gray-900 antialiased`}
      >
        <ToasterProvider />
        <main className="mx-auto max-w-screen-md p-4">{children}</main>
      </body>
    </html>
  );
}
