#!/bin/bash
set -e

LAYOUT_FILE="src/app/layout.tsx"

echo "🔧 Patching $LAYOUT_FILE to suppress hydration warnings..."
cat > "$LAYOUT_FILE" <<'EOF'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
EOF

echo "✅ Updated $LAYOUT_FILE"
