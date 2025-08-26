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

---

## 1. Add a Plant (`/plants/new`)
- [x] Build form with nickname and species autosuggest
- [x] Implement optional detail expanders (room, pot, light, notes, photo)
- [x] Call AI preview endpoint after species selection
- [x] Validate inputs and handle inline errors
- [x] Submit plant to backend and redirect to detail page

---

## 2. Plant Detail (`/plants/[id]`)
- [x] Layout hero image, nickname, species, and room badge
- [x] Display quick stats for last/next watering and cadence
- [x] Implement tabs for timeline, care plan, photos, notes
- [x] Add "Mark as watered" and event logging
- [x] Support schedule adjustments and AI suggestions

---

## 3. Daily Care – Today (`/today`)
- [x] Build checklist segmented into overdue, due, and upcoming
- [x] Implement task cards with quick actions (done, snooze, view)
- [x] Recompute schedule after marking tasks done
- [x] Animate task completion and movement between sections
- [x] Show empty state with CTA when there are no tasks

---

## 4. AI Care Coach
- [x] Collect environment and history data for suggestions
- [x] Surface AI nudges at key moments
- [x] Allow apply/dismiss, record feedback

---

## 5. Notifications & Reminders
- [x] Background job to check due/overdue tasks
- [x] Email or push notifications with deep links
 - [x] User controls for quiet hours and per-plant mute

---

## 6. Logging & Timeline
- [x] Define event types (watered, fertilized, notes, photos, etc.)
- [x] Entry points for logging from Today and plant detail views
- [x] Persist events and display them chronologically

---

## 7. Dashboard & Insights (`/dashboard`)
- [x] Create widgets for completion rate, overdue trends, and streaks
- [x] Highlight plants needing attention
- [x] (Optional) Graph ET₀/weather vs. watering patterns

---

## 8. Edit & Maintenance
- [x] Edit metadata, replace photo
- [x] Archive/delete flows

---

## 9. Error & Empty-State Handling
- [x] Free-text species when no match
- [x] Queue events offline and sync when back online
- [x] Graceful API error handling and missing permissions

---

## 10. Performance & UX Hygiene
- [x] SSR page shells with suspense for data
- [x] Cache weather and debounce species search
 - [x] Apply optimistic updates and ensure accessibility standards

---

## 11. Key Routes & APIs
- `/today`, `/plants`, `/plants/new`, `/plants/[id]`, `/dashboard`

---

## 12. Definition of Done
- **MVP:** plant creation with AI preview, Today tasks, basic timeline
- **v0.2:** metadata, AI nudges, notifications
- **v1:** insights dashboard, import/export, offline queueing

---

## 13. Next Round of Tasks (Beyond v1)

### Import / Export
- [x] Export plants + events as JSON or CSV
- [x] Import plants from JSON (validate schema)
- [x] Add “Download Backup” & “Restore” buttons in `/dashboard`

### Offline Queue & Sync
- [x] Add `offlineQueue.ts` util (queue failed POSTs to localStorage)
- [x] Retry queued events on reconnect
- [x] Add status badge for `Synced` vs `Pending`

### Photo Gallery Polish
- [x] Add carousel with swipe
 - [x] Support full-screen modal view
 - [x] Tag photos by event type

### Advanced AI Care Coach
 - [x] Daily digest summarizing all tasks
  - [x] Seasonal adjustments (light/humidity)
  - [x] Natural-language queries (“How’s Kay doing?”)

### Mobile Polish & PWA
- [x] Add manifest.json + icons
 - [x] Configure Next.js PWA plugin
- [ ] Test on iOS/Android as standalone app

### CI / CD Automation
- [x] GitHub Actions: run `pnpm lint`, `pnpm test`, and `pnpm e2e`
- [x] Preview deployments on Vercel
- [x] Add coverage reports

### Extended Insights
- [ ] Chart watering vs weather (ET₀ correlation)
- [ ] Show longest streaks per plant
- [ ] Highlight neglected plants

---
