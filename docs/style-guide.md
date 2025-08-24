# 🌿 Flora Style Guide (Merged)

This document is the canonical source of design standards for the Flora app. It consolidates all previous style guides and extensions.

*Tailwind CSS + shadcn/ui*

---

## 1) Design Principles

* **Clarity first**: every screen answers “what should I do next?”
* **Low friction**: fewer fields at a time; progressive disclosure.
* **Calm & warm**: soft contrast surfaces, generous whitespace, gentle motion.
* **Single-user focus**: personal, conversational copy (“Your plants”, “You watered Kay”).
* **Accessible by default**: WCAG AA contrast, obvious focus, keyboard & screen-reader parity.

---

## 2) Foundations

### 2.1 Typography

* **Primary**: `Inter` for all UI and body text.
* Sizes: `text-xs, sm, base, lg, xl, 2xl` (avoid more than 3 sizes per view).
* Weights: `400` (body), `500` (labels), `600` (section headings).

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

| Token                  | Light (HEX) | Dark (HEX) | Notes                 |
| ---------------------- | ----------- | ---------- | --------------------- |
| `--background`         | `#FFFFFF`   | `#0B1220`  | Base canvas           |
| `--foreground`         | `#111827`   | `#E5E7EB`  | Primary text          |
| `--card`               | `#FFFFFF`   | `#0E1626`  | Card surfaces         |
| `--primary`            | `#508C7E`   | `#5EA897`  | Calm green accent     |
| `--primary-foreground` | `#FAFAFA`   | `#0B1220`  | Text on primary       |
| `--accent`             | `#D3EDE6`   | `#183B35`  | Soft mint backgrounds |
| `--accent-foreground`  | `#1F3A37`   | `#E6F4F0`  | Text on accent        |
| `--muted`              | `#F3F5F7`   | `#101826`  | Subtle UI chrome      |
| `--muted-foreground`   | `#6B7280`   | `#94A3B8`  | Secondary text        |
| `--border`             | `#E5E7EB`   | `#1F2937`  | Dividers, inputs      |
| `--ring`               | `#508C7E`   | `#5EA897`  | Focus ring color      |

Add **semantic status tokens**:

```css
:root {
  --success: 152 60% 35%;
  --success-foreground: 0 0% 98%;
  --warning: 38 92% 50%;
  --warning-foreground: 222.2 84% 4.9%;
  --destructive: 0 72% 50%;
  --destructive-foreground: 0 0% 98%;
  --info: 210 100% 45%;
  --info-foreground: 0 0% 100%;
}
.dark {
  --success: 152 55% 45%;
  --warning: 38 65% 55%;
  --destructive: 0 70% 58%;
  --info: 210 90% 60%;
}
```

Map in Tailwind:

```ts
colors: {
  success: { DEFAULT: "hsl(var(--success))", foreground: "hsl(var(--success-foreground))" },
  warning: { DEFAULT: "hsl(var(--warning))", foreground: "hsl(var(--warning-foreground))" },
  destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
  info: { DEFAULT: "hsl(var(--info))", foreground: "hsl(var(--info-foreground))" },
}
```

### 2.3 Spacing, Radius, Shadow, Motion

* **Spacing**: `p-4/6/8`, `gap-3/4/6`.
* **Corners**: `rounded-xl` for cards, `rounded-lg` for inputs.
* **Depth**: `shadow-sm` resting, `shadow-md` on hover.
* **Motion durations**: 120–280ms based on element type.
* **Easings**: emphasized out, standard out, smooth in‑out (defined in globals).
* Respect `prefers-reduced-motion`.

---

## 3) Components

### 3.1 Cards

```tsx
<Card className="bg-card border rounded-xl">…</Card>
```

### 3.2 Inputs & Selects

With labels + hint text; icons with text.

### 3.3 Buttons

Variants: default, secondary, ghost, destructive.

### 3.4 Toasts

Ephemeral confirmations, auto‑dismiss 3–4s.

### 3.5 Empty States

Friendly, emoji/illustration + CTA.

### 3.6 Skeletons

List shimmer or card placeholders.

### 3.7 Task Card (new)

Anatomy: icon, title, meta, chip with status color, Done/Snooze buttons. Supports swipe + keyboard equivalents. States: overdue (warning), due today (primary), upcoming (muted).

### 3.8 Timeline Entry (new)

Rail + dots, entry card with title, time, note/media. Group by day, filterable. Type‑colored dots (water=primary, fertilize=info, note=muted, photo=accent).

---

## 4) Layout Patterns

* **Add Plant**: multi‑step card form.
* **Plant List**: grid/list toggle, room filters.
* **Plant Detail**: hero, quick stats, timeline, notes, gallery, Care Coach.
* **Today**: overdue/today/upcoming with swipe & buttons, snooze modal.
* **Home/Dashboard** (new): care load ring, overdue list, shortcuts.

---

## 5) Content & Microcopy

Calm, encouraging, specific. Examples provided for toasts, empty states, coach.

---

## 6) Accessibility

* Contrast ≥ 4.5:1; check chips both themes.
* Focus ring consistent: `ring-2 ring-primary`.
* Keyboard equivalents for swipes.
* Combobox roles, toasts as `role="status"`, timeline `<ol>` with `<time>`.
* Motion reduced when user prefers.

---

## 7) Data & States

* **Loading**: skeletons, don’t block secondary fetches.
* **Errors**: inline, retry.
* **Optimistic UI**: instant updates, rollback on error.

---

## 8) Motion Guidelines

* Page: 200–280ms fade/translate.
* Hover: 120–160ms lift.
* Task complete: 200ms fade, 100ms collapse.
* Generate plan: spinner → checkmark.

---

## 9) Iconography

Lucide‑react, stroke‑1.5, paired with labels.

---

## 10) Code Patterns

* Button variants with cva
* Card section patterns
* Toggle list/grid
* Empty state
* Accessible swipe alt buttons

---

## 11) QA Checklist

* Keyboard flows succeed
* Focus rings visible
* Contrast passes
* States covered (loading/error/empty)
* Optimistic updates
* Copy consistent

---

## 12) File Placement

* `components/ui/*`: shadcn overrides
* `components/plant/TaskCard.tsx`, `TimelineEntry.tsx`
* `components/metrics/CompletionRing.tsx`
* `lib/a11y.ts`, `lib/motion.ts`

---

## 13) Deviation Policy

Extend tokens/components before ad‑hoc styling. Document any deviations in `/docs/design-decisions.md` with rationale.

---

## References

* Tailwind, shadcn/ui, Radix, WAI‑ARIA APG, Lucide, next-themes
