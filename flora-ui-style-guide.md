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
- **Headlines** → `Cabinet Grotesk` (600–700 weight)  
- **Body/UI** → `Inter` (400–500 weight)

Sizes: `xs, sm, base, lg, xl, 2xl` (≤ 3 per view).

```tsx
import { Inter, Cabin } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cabinet = Cabin({ subsets: ["latin"], variable: "--font-cabinet" });
// <html className={`${inter.variable} ${cabinet.variable}`}>
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

# References
- [Tailwind CSS](https://tailwindcss.com/docs)  
- [shadcn/ui](https://ui.shadcn.com)  
- [Radix UI](https://www.radix-ui.com/primitives)  
- [Lucide Icons](https://lucide.dev)  
- [next-themes](https://github.com/pacocoursey/next-themes)  
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)  
