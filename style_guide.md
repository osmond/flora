# 🌿 Flora UI Style Guide
_Tailwind CSS + shadcn/ui_

## 1) Design Principles
- **Clarity first**: every screen answers “what should I do next?”
- **Low friction**: fewer fields at a time; progressive disclosure.
- **Calm & warm**: soft contrast surfaces, generous whitespace, gentle motion.
- **Single-user focus**: personal, conversational copy (“Your plants”, “You watered Kay”).
- **Accessible by default**: WCAG AA contrast, obvious focus, keyboard & screen-reader parity.

---

## 2) Foundations

### 2.1 Typography
- **Primary**: `Inter` for all UI and body text.
- Sizes: `text-xs, sm, base, lg, xl, 2xl` (avoid more than 3 sizes per view).
- Weights: `400` (body), `500` (labels), `600` (section headings).

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// <html className={`${inter.variable}`}> ... </html>

// app/globals.css
:root { --font-inter: Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; }
.body { font-family: var(--font-inter); }
```

### 2.2 Color & Theming (with `next-themes` + shadcn tokens)
Use shadcn’s CSS variable contract. Set hue/sat/light once; consume via Tailwind.

**Starter Palette**

| Token | Light (HEX) | Dark (HEX) | Notes |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#0B1220` | Base canvas |
| `--foreground` | `#111827` | `#E5E7EB` | Primary text |
| `--card` | `#FFFFFF` | `#0E1626` | Card surfaces |
| `--primary` | `#508C7E` | `#5EA897` | Calm green accent |
| `--primary-foreground` | `#FAFAFA` | `#0B1220` | Text on primary |
| `--accent` | `#D3EDE6` | `#183B35` | Soft mint backgrounds |
| `--accent-foreground` | `#1F3A37` | `#E6F4F0` | Text on accent |
| `--muted` | `#F3F5F7` | `#101826` | Subtle UI chrome |
| `--muted-foreground` | `#6B7280` | `#94A3B8` | Secondary text |
| `--border` | `#E5E7EB` | `#1F2937` | Dividers, inputs |
| `--ring` | `#508C7E` | `#5EA897` | Focus ring color |

```css
/* app/globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;            /* #FFFFFF */
    --foreground: 222.2 47.4% 11.2%;    /* #111827 */
    --card: 0 0% 100%;                  /* #FFFFFF */
    --card-foreground: 222.2 47.4% 11.2%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 47.4% 11.2%;
    --primary: 160 22% 44%;             /* ~#508C7E */
    --primary-foreground: 0 0% 98%;     /* near-white */
    --muted: 210 40% 96.1%;             /* #F3F5F7 */
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 160 32% 92%;              /* ~#D3EDE6 */
    --accent-foreground: 160 22% 20%;
    --border: 214.3 31.8% 91.4%;
    --ring: 160 22% 44%;
    --radius: 1rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;       /* #0B1220 */
    --foreground: 210 40% 98%;          /* #E5E7EB */
    --card: 222.2 84% 5.5%;             /* #0E1626 */
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 5.5%;
    --popover-foreground: 210 40% 98%;
    --primary: 160 22% 52%;             /* ~#5EA897 */
    --primary-foreground: 222.2 84% 5%;
    --muted: 217.2 32.6% 10%;           /* #101826 */
    --muted-foreground: 215 20.2% 65.1%;/* #94A3B8 */
    --accent: 160 22% 16%;              /* #183B35 */
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 12%;
    --ring: 160 22% 52%;
  }
}
```

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
};
```

### 2.3 Spacing, Radius, Shadow, Motion
- **Spacing**: `p-4/6/8`, `gap-3/4/6`.
- **Corners**: `rounded-xl` for cards, `rounded-lg` for inputs.
- **Depth**: `shadow-sm` resting, `shadow-md` on hover.
- **Motion**: `ease-out` 150–200ms; respect `prefers-reduced-motion`.

---

## 3) Components (shadcn/ui usage)

### 3.1 Cards
Group steps: Identify, Placement, Pot Setup, Smart Plan. Include clear title/help.

```tsx
<Card className="bg-card border rounded-xl">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg">🌱 Identify</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">…fields…</CardContent>
</Card>
```

### 3.2 Inputs & Selects
Always pair with `<Label>` and hint text. Icons + text for categorical selects.

```tsx
<Label htmlFor="light">Light Level</Label>
<Select onValueChange={(v)=> setValue("lightLevel", v)}>
  <SelectTrigger id="light"><SelectValue placeholder="Choose" /></SelectTrigger>
  <SelectContent>
    <SelectItem value="Low">☁️ Low</SelectItem>
    <SelectItem value="Medium">⛅ Medium</SelectItem>
    <SelectItem value="Bright">☀️ Bright</SelectItem>
  </SelectContent>
</Select>
```

### 3.3 Buttons
Variants: `default` (primary), `secondary` (minor), `ghost` (inline), `destructive` (danger).

### 3.4 Toasts
Use for ephemeral confirmations (e.g., “Plant saved”). `aria-live="polite"`; auto-dismiss ~3–4s.

### 3.5 Empty States
Friendly emoji/illustration, one sentence, one primary CTA.

```tsx
<div className="rounded-xl border p-8 text-center bg-muted/30">
  <div className="text-3xl mb-2">🌿</div>
  <h3 className="font-semibold mb-1">No plants yet</h3>
  <p className="text-muted-foreground mb-4">Add your first plant to get personalized care.</p>
  <Button asChild><a href="/add">Add a Plant</a></Button>
</div>
```

### 3.6 Skeletons & Loading
Lists: 3–5 rows with shimmer. Cards: image box + 2–3 text bars.

---

## 4) Layout Patterns (mapped to features)

### 4.1 Add Plant (multi-section form)
Steps: Identify → Placement → Pot Setup → Environment → Smart Plan → Confirm.
- Show "Environment" once geolocation resolves; otherwise show non-blocking hint.
- **Generate Care Plan**: inline result card with bullets + "Why this?" rationale.
- Photo: thumbnail preview; drag & drop.

### 4.2 Plant List (list/grid + rooms)
Toolbar: room filter (Select), view toggle, search.
- **Grid**: photo → name → quick stat pill (“Water in 2d”).
- **List**: avatar, name, room, next task chip.

### 4.3 Plant Detail
Photo hero; action bar (Edit, Add Note, Add Photo).
- **Quick Stats**: small pills (Water every X, Last/Next).
- **Timeline**: reverse-chron; filter chips (All/Water/Fertilize/Notes/Photos).
- **Care Coach**: appears when overdue; soft accent card; up to 2 suggestions.

### 4.4 Today (Overdue / Today / Upcoming)
Sectioned lists; sticky subheaders.
- Swipe: right=complete, left=snooze; provide button equivalents.
- Snooze modal: optional reason selector + text; remember last choice.

### 4.5 Import/Export
Grouped actions; show format hints; confirm before overwrite.

---

## 5) Content & Microcopy
Tone: calm, encouraging, specific.
- Toast: “Saved. Kay’s detail page is ready.”
- Empty state: “You don’t have any plants yet. Add your first one to get personalized care.”
- Coach: “Soil might still be moist—check 1–2 cm below the surface.”

---

## 6) Accessibility
- **Contrast**: ≥ 4.5:1; verify pills in both themes.
- **Focus**: `ring-2 ring-primary` on interactive; consistent across components.
- **Keyboard**: swipe actions mirrored as buttons; dialogs focus-trapped; `Esc` dismiss.
- **ARIA**: autosuggest (combobox), toasts (`role="status"`), timeline (`<ol>` with time).
- **Motion**: respect `prefers-reduced-motion`.

---

## 7) Data & States
- **Loading**: skeleton first; never block route on secondary fetches.
- **Errors**: inline, specific; offer retry.
- **Optimistic UI**: task complete → fade out immediately; restore on error.

---

## 8) Motion Guidelines
- Page transitions: 150–200ms opacity/translate-y(8px).
- Card hover: subtle lift (`shadow-md translate-y-[-1px]`).
- Task complete: 200ms fade-out, 100ms collapse height.
- Generate Plan: spinner → checkmark; result card expands.

---

## 9) Iconography
Use **lucide-react**. Keep line icons at `stroke-[1.5]`. Pair with labels.

---

## 10) Code Patterns (snippets)

### 10.1 Button Variants (cva)
```ts
// components/ui/button.ts (extend shadcn baseline)
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-95",
        secondary: "bg-accent text-accent-foreground hover:opacity-90",
        ghost: "hover:bg-muted",
        destructive: "bg-red-600 text-white hover:bg-red-700",
      },
      size: { sm: "h-9 px-3", md: "h-10 px-4", lg: "h-11 px-6" },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);
```

### 10.2 Card Section
```tsx
<Card className="bg-card/95 border rounded-xl">
  <CardHeader className="pb-3">
    <CardTitle className="text-lg">🪴 Pot Setup</CardTitle>
  </CardHeader>
  <CardContent className="grid gap-4 sm:grid-cols-2">{/* inputs */}</CardContent>
</Card>
```

### 10.3 List/Grid Toggle
```tsx
<ToggleGroup type="single" defaultValue="grid" className="ml-auto">
  <ToggleGroupItem value="list" aria-label="List view">List</ToggleGroupItem>
  <ToggleGroupItem value="grid" aria-label="Grid view">Grid</ToggleGroupItem>
</ToggleGroup>
```

### 10.4 Empty State
```tsx
<div className="rounded-xl border p-8 text-center bg-muted/30">
  <div className="text-3xl mb-2">🌿</div>
  <h3 className="font-semibold mb-1">No plants yet</h3>
  <p className="text-muted-foreground mb-4">Add your first plant to get personalized care.</p>
  <Button asChild><a href="/add">Add a Plant</a></Button>
</div>
```

### 10.5 Accessible Swipe Alternative
```tsx
<div className="flex items-center gap-2">
  <Button size="sm" onClick={completeTask}>Done</Button>
  <Button size="sm" variant="secondary" onClick={openSnooze}>Snooze</Button>
</div>
```

---

## 11) QA Checklist (per view)
- Keyboard-only flows succeed.
- Focus rings visible and consistent.
- Contrast passes in light/dark.
- Loading / error / empty states present.
- Optimistic updates where sensible.
- Copy is short, specific, consistent.

---

## 12) Mapping to Features
- **Add Plant**: multi-card form, autosuggest (combobox), photo preview, inline AI plan card.
- **Rooms + List/Grid**: toolbar with room select + toggle; card/list patterns.
- **Detail Page**: photo hero, quick-stat pills, timeline (filterable), notes & gallery.
- **Care Coach**: accent card only when overdue; up to 2 suggestions + CTA.
- **Home (/)**: sectioned lists; swipe + button alternatives; snooze modal with optional reason.
- **Push Notifications**: tone and iconography align with toasts.
- **Import/Export**: grouped actions, guardrails, confirmation.
- **Theme Toggle**: navbar action; persists via `next-themes`.

---

## References
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com/primitives
- WAI-ARIA APG: https://www.w3.org/WAI/ARIA/apg/
- Lucide Icons: https://lucide.dev
- next-themes: https://github.com/pacocoursey/next-themes

