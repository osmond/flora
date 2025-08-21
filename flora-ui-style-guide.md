# 🌿 Flora UI Style Guide
_Tailwind CSS + shadcn/ui_

This document is organized into three sections: **Style Tokens**, **Components**, and **Patterns**.  
It serves as the design/development reference for Flora’s UI.

---

# 1. Style Tokens
Foundations for colors, typography, spacing, motion.

## 1.1 Design Principles
- **Clarity first**: every screen answers “what should I do next?”
- **Low friction**: progressive disclosure, fewer fields at a time.
- **Calm & warm**: soft contrast, whitespace, gentle motion.
- **Single-user focus**: personal copy (“You watered Kay”).
- **Accessible by default**: WCAG AA+, keyboard & SR parity.

---

## 1.2 Typography
- **All text** → `Inter` (400–700 weight)

Sizes: `xs, sm, base, lg, xl, 2xl` (≤ 3 per view).

```tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// <html className={inter.variable}>
```

---

## 1.3 Color Palette (light/dark + semantic)
Using shadcn’s CSS variable contract + `next-themes`.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#0B1220` | Base canvas |
| `--foreground` | `#111827` | `#E5E7EB` | Text |
| `--primary` | `#508C7E` | `#5EA897` | Calm green |
| `--accent` | `#D3EDE6` | `#183B35` | Mint surface |
| `--muted` | `#F3F5F7` | `#101826` | UI chrome |
| `--border` | `#E5E7EB` | `#1F2937` | Inputs/dividers |
| `--ring` | `#508C7E` | `#5EA897` | Focus |

**Semantic**  
- `--success`: `#22C55E` / dark `#16A34A`  
- `--warning`: `#FACC15` / dark `#EAB308`  
- `--destructive`: `#DC2626` / dark `#B91C1C`  

---

## 1.4 Spacing, Radius, Shadow, Motion
- **Spacing**: `p-4/6/8`, `gap-3/4/6`
- **Corners**: `rounded-xl` (cards), `rounded-lg` (inputs)
- **Shadows**: `shadow-sm` rest, `shadow-md` hover
- **Motion**: 150–200ms `ease-out`, respect `prefers-reduced-motion`

---

# 2. Components
Building blocks, based on shadcn/ui + lucide-react.

## 2.1 Cards
```tsx
<Card>
  <CardHeader><CardTitle>🌱 Identify</CardTitle></CardHeader>
  <CardContent>…fields…</CardContent>
</Card>
```

## 2.2 Inputs & Selects
```tsx
<Label htmlFor="light">Light</Label>
<Select>…</Select>
```

## 2.3 Buttons
- **default** → primary green  
- **secondary** → mint accent  
- **ghost** → inline actions  
- **destructive** → danger red

## 2.4 Dialogs / Modals
```tsx
<Dialog>
  <DialogTrigger><Button>Snooze</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader><DialogTitle>Snooze Task</DialogTitle></DialogHeader>
    <SnoozeForm />
  </DialogContent>
</Dialog>
```

## 2.5 Toolbars
```tsx
<div className="flex items-center gap-2">
  <Select … /> <ToggleGroup … />
</div>
```

## 2.6 Badges / Pills
```tsx
<Badge variant="outline">Water in 2d</Badge>
```

## 2.7 Toasts
```tsx
toast({ title: "Saved", description: "Kay’s detail page is ready." });
```

## 2.8 Empty States
```tsx
<div className="rounded-xl border p-8 text-center bg-muted/30">
  <div className="text-3xl mb-2">🌿</div>
  <h3 className="font-semibold mb-1">No plants yet</h3>
  <p className="text-muted-foreground mb-4">Add your first plant to get personalized care.</p>
  <Button asChild><a href="/add">Add a Plant</a></Button>
</div>
```

## 2.9 Skeletons
3–5 shimmer rows for lists, image + text placeholders for cards.

## 2.10 Error / Offline States
- **Error** → red border + helper text  
- **Offline** → subtle banner (“You’re offline, changes will sync later”)  

---

# 3. Patterns
Layout templates mapped to app features.

## 3.1 Add Plant Flow
Steps: Identify → Placement → Pot Setup → Environment → Smart Plan → Confirm.  
- Show environment fields after geolocation resolves.  
- Inline AI care plan card w/ rationale.  

## 3.2 Plant List (List/Grid + Rooms)
- Toolbar with room filter + toggle.  
- **Grid**: photo → name → stat pill  
- **List**: avatar, name, room, next task chip  

## 3.3 Plant Detail
- **Photo hero** + action bar  
- **Quick Stats** → pills (“Water every 5d”)  
- **Timeline** → reverse-chron, filter chips  
- **Care Coach** → accent card, up to 2 nudges  

## 3.4 Today (/today)
- Sections: Overdue / Today / Upcoming  
- **Swipe**: right=done, left=snooze  
- **Accessible buttons** as alternative  
- **Snooze Modal** → optional reason  

## 3.5 Import/Export
Grouped actions + confirm modal before overwrite.  

## 3.6 Theme Toggle
Persist via `next-themes`.  

---

## 3.7 Motion Guidelines
- Page transition: 150–200ms fade/translate  
- Card hover: `shadow-md translate-y-[-1px]`  
- Task complete: 200ms fade + collapse  
- List load-in: stagger 30ms per item  

## 3.8 Accessibility
- Contrast ≥ 4.5:1  
- Focus → `ring-2 ring-primary`  
- Swipe actions mirrored as buttons  
- Dialogs → focus-trapped, `Esc` dismiss
- Autosuggest → ARIA combobox pattern

---

# 4. Preview Page Example
Full-page component demonstrating Flora’s tokens and components in action.

```tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Droplet,
  Sun,
  Calendar,
  CheckCircle2,
  Leaf,
  Plus,
  Image as ImageIcon,
  ThermometerSun,
  MapPin,
} from "lucide-react";

export default function FloraPreviewPage() {
  return (
    <div className="p-8 space-y-12 bg-background min-h-screen font-inter">
      {/* Typography / Intro */}
      <section>
        <h1 className="text-3xl font-cabinet font-semibold mb-2">Flora UI Preview</h1>
        <p className="text-muted-foreground text-sm">Component showcase for consistent styling and QA.</p>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button><Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline"><Leaf className="mr-2 h-4 w-4" strokeWidth={1.5} />Outline</Button>
        </div>
      </section>

      {/* Plant Card */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Plant Card</h2>
        <Card className="max-w-xs">
          <CardHeader>
            <Avatar>
              <AvatarImage src="/placeholder-plant.jpg" alt="Monstera" />
              <AvatarFallback>M</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-2 font-cabinet">Monstera</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground font-inter">Room: Living Room</CardContent>
        </Card>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Quick Stats</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline"><Droplet className="mr-1 h-3 w-3" strokeWidth={1.5} />Water: Every 7d</Badge>
          <Badge variant="outline"><Sun className="mr-1 h-3 w-3" strokeWidth={1.5} />Light: Bright Indirect</Badge>
          <Badge variant="secondary"><Calendar className="mr-1 h-3 w-3" strokeWidth={1.5} />Last watered: 2d ago</Badge>
        </div>
      </section>

      {/* Task Card */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Task Card</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="font-cabinet">Water Monstera</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-inter">Due today</p>
            <Button size="sm"><CheckCircle2 className="mr-1 h-4 w-4" strokeWidth={1.5} />Mark Done</Button>
          </CardContent>
        </Card>
      </section>

      {/* Timeline Entry */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Timeline Entry</h2>
        <div className="flex items-start gap-3">
          <div className="h-2 w-2 rounded-full bg-primary mt-2" />
          <div>
            <p className="font-medium font-inter">Watered Monstera</p>
            <p className="text-sm text-muted-foreground font-inter">Aug 20, 2025</p>
          </div>
        </div>
      </section>

      {/* Gallery Tile */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Gallery Tile</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="aspect-square bg-secondary flex items-center justify-center rounded-xl">
            <ImageIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="aspect-square bg-secondary flex items-center justify-center rounded-xl">
            <ImageIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="aspect-square bg-secondary flex items-center justify-center rounded-xl">
            <ImageIcon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Form Controls */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Form Controls</h2>
        <div className="space-y-4">
          <Input placeholder="Enter plant name..." />
          <div className="flex items-center gap-2">
            <Switch id="indoor-outdoor" />
            <label htmlFor="indoor-outdoor" className="text-sm font-medium font-inter">Indoor plant</label>
          </div>
        </div>
      </section>

      {/* Plant Detail Hero */}
      <section>
        <h2 className="text-xl font-cabinet font-semibold mb-4">Plant Detail Hero</h2>
        <div className="rounded-2xl overflow-hidden border">
          {/* Cover image placeholder */}
          <div className="h-48 sm:h-64 bg-muted" />
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-2xl font-cabinet">Kay (Monstera deliciosa)</h3>
                <p className="text-xs text-muted-foreground font-inter flex items-center gap-2 mt-1">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} /> Living Room · <ThermometerSun className="h-3.5 w-3.5" strokeWidth={1.5} /> 45% humidity
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary"><ImageIcon className="mr-1 h-4 w-4" strokeWidth={1.5} />Add Photo</Button>
                <Button size="sm"><Leaf className="mr-1 h-4 w-4" strokeWidth={1.5} />Edit Care Plan</Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Quick stats row inside hero */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline"><Droplet className="mr-1 h-3 w-3" strokeWidth={1.5} />Every 5d</Badge>
              <Badge variant="outline"><Calendar className="mr-1 h-3 w-3" strokeWidth={1.5} />Last 2d</Badge>
              <Badge variant="outline"><Calendar className="mr-1 h-3 w-3" strokeWidth={1.5} />Next in 3d</Badge>
              <Badge variant="outline"><Sun className="mr-1 h-3 w-3" strokeWidth={1.5} />Bright indirect</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

# References
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com/primitives)  
- [Lucide Icons](https://lucide.dev)  
- [next-themes](https://github.com/pacocoursey/next-themes)  
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)  
