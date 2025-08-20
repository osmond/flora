#!/bin/bash

LAYOUT_FILE="src/app/layout.tsx"

echo "🔧 Patching $LAYOUT_FILE with required <html> and <body> tags..."

cat > "$LAYOUT_FILE" <<EOF
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

echo "✅ Root layout updated successfully."
