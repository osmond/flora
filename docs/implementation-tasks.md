# 🌿 Flora App Implementation Tasks

This document is the canonical implementation guide for Flora.  
It breaks down the roadmap into actionable steps, with **acceptance criteria** and **UI snippets** that define the intended look & feel.  
Use these snippets directly when building — they are Tailwind v4 + shadcn/ui compatible.

---

## 🔧 Visual Baseline (Tokens & Rules)

**Theme tokens (Tailwind v4, HSL vars in `globals.css`):**
```
--background, --foreground, --card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--destructive, --destructive-foreground
--border, --input, --ring, --radius
```

**UI rules:**
- Containers: `max-w-lg` for forms, `max-w-6xl` for dashboards
- Corners: `rounded-2xl` for cards, `rounded-md` for inputs/buttons
- Motion: subtle hover opacity/translate, no heavy parallax
- A11y: visible `focus-visible:ring-2 ring-ring ring-offset-2`

---

## 0. First Run & Setup
- [x] Detect user theme and load fonts
- [x] Load user profile and feature flags
- [x] Request location permission and cache city/lat/lon
- [x] Fetch and cache weather data (30–60 min)
- [x] Render empty state with CTA to add first plant

**Empty State Example:**
```tsx
export function EmptyToday() {
  return (
    <div className="text-center py-20 space-y-4">
      <p className="text-lg font-medium">No plants yet 🌱</p>
      <p className="text-sm text-muted-foreground">Add your first plant to get started.</p>
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">
        Add a Plant
      </button>
    </div>
  );
}
```

---

## 1. Add a Plant (`/plants/new`)
- [ ] Build form with nickname and species autosuggest
- [ ] Implement optional detail expanders (room, pot, light, notes, photo)
- [ ] Call AI preview endpoint after species selection
- [ ] Validate inputs and handle inline errors
- [ ] Submit plant to backend and redirect to detail page

**Form Example:**
```tsx
<div className="max-w-lg mx-auto space-y-6">
  <h1 className="text-2xl font-semibold">Add a Plant</h1>
  <div className="space-y-2">
    <Label htmlFor="nickname">Nickname</Label>
    <Input id="nickname" placeholder="e.g. Kay" className="h-10" />
  </div>
  <div className="space-y-2">
    <Label htmlFor="species">Species</Label>
    <Input id="species" placeholder="Search species…" className="h-10" />
  </div>
  <Button className="w-full">Create Plant</Button>
</div>
```

**AI Preview Box Example:**
```tsx
<div className="rounded-md border bg-secondary/30 p-4 text-sm">
  <p className="font-medium">AI Care Preview</p>
  <p className="text-muted-foreground">
    Pothos prefers bright indirect light. Water every 5–7 days in summer, 10–14 days in winter.
  </p>
</div>
```

---

## 2. Plant Detail (`/plants/[id]`)
- [ ] Layout hero image, nickname, species, and room badge
- [ ] Display quick stats for last/next watering and cadence
- [ ] Implement tabs for timeline, care plan, photos, notes
- [ ] Add "Mark as watered" and event logging
- [ ] Support schedule adjustments and AI suggestions

**Hero + Quick Stats Example:**
```tsx
<div>
  <img src="/placeholder.png" className="w-full h-48 object-cover rounded-xl" />
  <div className="mt-4 flex items-center justify-between">
    <div>
      <h2 className="text-xl font-semibold">Kay</h2>
      <p className="text-sm text-muted-foreground">Epipremnum aureum (Pothos)</p>
    </div>
    <Button variant="outline" size="sm">Edit</Button>
  </div>
  <div className="grid grid-cols-3 gap-3 mt-6">
    <StatPill icon="💧" label="Last watered" value="2d ago" />
    <StatPill icon="⏭️" label="Next due" value="in 3d" />
    <StatPill icon="🌞" label="Light" value="Bright indirect" />
  </div>
</div>
```

**Timeline Example:**
```tsx
<ul className="mt-6 space-y-4">
  <li className="flex items-start gap-3">
    <span>💧</span>
    <div>
      <p className="text-sm font-medium">Watered</p>
      <p className="text-xs text-muted-foreground">Aug 22, 2025</p>
    </div>
  </li>
  <li className="flex items-start gap-3">
    <span>🖼️</span>
    <div>
      <p className="text-sm font-medium">Photo added</p>
      <img src="/photo.jpg" className="w-24 h-24 rounded-md mt-1" />
    </div>
  </li>
</ul>
```

---

## 3. Daily Care – Today (`/today`)
- [ ] Build checklist segmented into overdue, due, and upcoming
- [ ] Implement task cards with quick actions (done, snooze, view)
- [ ] Recompute schedule after marking tasks done
- [ ] Animate task completion and movement between sections

**Task Row Example:**
```tsx
<div className="flex items-center gap-3 rounded-xl border bg-card px-3 py-3">
  <div className="h-10 w-10 grid place-items-center rounded-full bg-muted">🪴</div>
  <div className="flex-1 min-w-0">
    <div className="text-sm font-medium">Water Kay</div>
    <div className="text-xs text-muted-foreground">Overdue by 2d</div>
  </div>
  <Button size="sm">Done</Button>
</div>
```

---

## 4. AI Care Coach
- [ ] Collect environment and history data for suggestions
- [ ] Surface AI nudges at key moments
- [ ] Allow apply/dismiss, record feedback

**Nudge Example:**
```tsx
<div className="rounded-md border-l-4 border-emerald-500 bg-emerald-50 p-4 text-sm">
  <p className="font-medium">AI Suggestion</p>
  <p className="text-muted-foreground">Skip watering Kay today — humidity is high 🌧</p>
  <div className="mt-2 flex gap-2">
    <Button size="sm">Apply</Button>
    <Button size="sm" variant="outline">Dismiss</Button>
  </div>
</div>
```

---

## 5. Notifications & Reminders
(Background jobs, emails, push — no direct UI snippet needed here.)

---

## 6. Logging & Timeline
Reuses Plant Detail timeline snippet above.

---

## 7. Dashboard & Insights (`/dashboard`)
- [ ] Create widgets for completion rate, overdue trends, and streaks
- [ ] Highlight plants needing attention

**Dashboard Card Example:**
```tsx
<div className="rounded-xl border bg-card p-6">
  <p className="text-sm text-muted-foreground">Weekly Completion</p>
  <p className="text-3xl font-bold">85%</p>
</div>
```

---

## 8. Edit & Maintenance
- [ ] Edit metadata, replace photo
- [ ] Archive/delete flows

---

## 9. Error & Empty-State Handling
See empty state example in section 0.

---

## 10. Performance & UX Hygiene
(General principles; no snippet)

---

## 11. Key Routes & APIs
- `/today`, `/plants`, `/plants/new`, `/plants/[id]`, `/dashboard`

---

## 12. Definition of Done
- **MVP:** plant creation with AI preview, Today tasks, basic timeline
- **v0.2:** metadata, AI nudges, notifications
- **v1:** insights dashboard, import/export, offline queueing

---
