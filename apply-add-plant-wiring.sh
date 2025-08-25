#!/bin/bash
set -euo pipefail

echo "🌿 Applying Flora Add-Plant wiring patch..."

# Ensure we're at the project root (best-effort check)
if [ ! -d "src" ]; then
  echo "This script expects a Next.js project with a ./src directory. Run it from your repo root."
  exit 1
fi

# 1) Tailwind config — content paths + dark mode + tokens
cat > tailwind.config.ts <<'EOF'
import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
EOF

# 2) globals.css — Tailwind layers + CSS variables
mkdir -p src/app
cat > src/app/globals.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 166 30% 51%;
    --primary-foreground: 210 20% 98%;
    --secondary: 170 42% 86%;
    --secondary-foreground: 163 93% 14%;
    --muted: 218 11% 65%;
    --muted-foreground: 215 20% 50%;
    --accent: 170 42% 86%;
    --accent-foreground: 163 93% 14%;
    --destructive: 0 100% 50%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 166 30% 51%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 220 49% 8%;
    --foreground: 210 13% 91%;
    --card: 220 46% 10%;
    --card-foreground: 210 13% 91%;
    --primary: 166 30% 51%;
    --primary-foreground: 220 49% 98%;
    --secondary: 170 42% 16%;
    --secondary-foreground: 163 93% 91%;
    --muted: 218 11% 41%;
    --muted-foreground: 215 20% 65%;
    --accent: 170 42% 16%;
    --accent-foreground: 163 93% 91%;
    --destructive: 0 62% 30%;
    --destructive-foreground: 210 13% 91%;
    --border: 220 7% 18%;
    --input: 220 7% 18%;
    --ring: 166 30% 51%;
  }

  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
EOF

# 3) utils.ts — cn()
mkdir -p src/lib
cat > src/lib/utils.ts <<'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# 4) New-plant page shell
mkdir -p src/app/plants/new
cat > src/app/plants/new/page.tsx <<'EOF'
import AddPlantForm from "@/components/plant/AddPlantForm"

export const metadata = {
  title: "Add Plant — Flora",
}

export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Add a Plant</h1>
        <AddPlantForm />
      </div>
    </main>
  )
}
EOF

# 5) AddPlantForm.tsx — styled form that posts to /api/plants
mkdir -p src/components/plant
cat > src/components/plant/AddPlantForm.tsx <<'EOF'
'use client';

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SpeciesAutosuggest from "./SpeciesAutosuggest";

export default function AddPlantForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [speciesScientific, setSpeciesScientific] = useState("");
  const [speciesCommon, setSpeciesCommon] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          speciesScientific,
          speciesCommon,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create plant");
      const id = json?.plant?.id;
      if (id) router.push(`/plants/${id}`);
      else router.push(`/plants`);
    } catch (e: any) {
      setErr(e.message || "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-4 p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              placeholder="e.g. Kay"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Species</Label>
            <SpeciesAutosuggest
              value={speciesCommon || speciesScientific}
              onSelect={(scientific: string, common?: string) => {
                setSpeciesScientific(scientific);
                setSpeciesCommon(common);
              }}
            />
          </div>

          {err ? <p className="text-sm text-destructive">{err}</p> : null}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating…" : "Create Plant"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
EOF

# 6) API route — server-side insert into Supabase
mkdir -p src/app/api/plants
cat > src/app/api/plants/route.ts <<'EOF'
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create a server client using service role (server-only).
function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) {
    throw new Error("Missing SUPABASE env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = supabaseServer();
    const payload = {
      nickname: body?.nickname ?? null,
      species_scientific: body?.speciesScientific ?? null,
      species_common: body?.speciesCommon ?? null,
    };
    const { data, error } = await supabase.from("plants").insert(payload).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ plant: data }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Server error" }, { status: 500 });
  }
}
EOF

chmod +x "$0"

echo ""
echo "✅ Done."
echo "Next steps:"
echo "  1) Ensure .env.local has:"
echo "       NEXT_PUBLIC_SUPABASE_URL=..."
echo "       SUPABASE_SERVICE_ROLE_KEY=...   # server-only"
echo "  2) Restart dev server: pnpm dev"
echo "  3) Open http://localhost:3000/plants/new and create a plant."
