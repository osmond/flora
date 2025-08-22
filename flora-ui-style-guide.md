
# 🌿 Flora App Style Guide

This style guide defines the visual and interaction patterns used in the Flora plant care app. It ensures consistency, usability, and a calming tone across the entire user interface.

---

## 🎨 Color Palette

| Token        | Hex       | Description                        |
| ------------ | --------- | ---------------------------------- |
| `primary`    | `#508C7E` | Soft sage green – main accent      |
| `secondary`  | `#D3EDE6` | Pale mint – highlights/backgrounds |
| `background` | `#F9F9F9` | Main app background                |
| `foreground` | `#111827` | Text on light backgrounds          |
| `muted`      | `#9CA3AF` | For timestamps, descriptions       |

> Tailwind tokens map to `bg-background`, `text-foreground`, etc., via shadcn's theme config.

---

## 🕋 Typography

| Use Case     | Font Family     | Weight  | Tailwind Classes                   |
| ------------ | --------------- | ------- | ---------------------------------- |
| Headings     | Cabinet Grotesk | 600–700 | `text-xl font-semibold`, etc.      |
| Body/UI Text | Inter           | 400–500 | `text-sm`, `text-muted-foreground` |

* Use clear visual hierarchy:
  `xl` → Page title
  `lg` → Section header
  `base` → Paragraph
  `sm` → Timestamps & footnotes

---

## 🧹 Components

Flora uses [shadcn/ui](https://ui.shadcn.com) for all base components.

| Component                 | Notes                                                    |
| ------------------------- | -------------------------------------------------------- |
| `Button`                  | Use variants: `default`, `secondary`, `outline`, `ghost` |
| `Card`                    | For grouping content (e.g., tasks, stats)                |
| `Input` / `Textarea`      | For forms, paired with `Label`                           |
| `Switch`, `Checkbox`      | Use for toggles                                          |
| `Tabs`, `Sheet`, `Dialog` | For advanced layouts                                     |

> Always prefer accessible components (e.g., `Label` for `Input`).

---

## 📀 Spacing & Layout

* **Padding & margin**: Use Tailwind spacing scale (`p-4`, `gap-6`, etc.)
* **Cards**: `rounded-2xl shadow-sm p-4`
* **Mobile-first**: Layouts default to single-column mobile; use `md:` breakpoints for responsive grid or flex layouts.

---

## 🔤 Icons

Use `lucide-react`. Common icons:

* `Check`, `Snooze`, `CalendarClock`, `Droplet`, `Sun`, `Thermometer`

> Icons should match text size and use `text-muted-foreground` when secondary.

---

## 🧠 Interaction Design

* **Primary actions**: Buttons are prominent, `variant="default"` (green).
* **Feedback**: Use toast or button state (`loading`, `success`) for confirmation.
* **Empty states**: Always provide calm encouragement and CTAs.

---

## 🖼 Image Guidelines

* Use full-width plant hero images on detail pages.
* Gallery images use `aspect-square` or `aspect-[4/3]` and `rounded-xl`.

---

## ❌ Don’ts

* ❌ Avoid unstyled native `<input>`s — use `Input` from shadcn.
* ❌ Avoid mixing inline Tailwind and component props unnecessarily.
* ❌ Avoid redundant cards inside cards.

---

## ✅ Example Layouts

You can preview example UI components in `/preview` (or `PreviewPage.tsx`).

---

Let this guide evolve as the app grows. For visual references, see the canvas mockups.
