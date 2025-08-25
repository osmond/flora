# 🌿 Flora App Implementation Tasks

The following tasks break down the "Full Roadmap & Visual Walkthrough" into actionable steps. They are ordered to build the app from first run through ongoing insights.

## 0. First Run & Setup
- [ ] Detect user theme and load fonts
- [ ] Load user profile and feature flags
- [ ] Request location permission and cache city/lat/lon
- [ ] Fetch and cache weather data (30–60 min)
- [ ] Render empty state with CTA to add first plant

## 1. Add a Plant (`/plants/new`)
- [ ] Build form with nickname and species autosuggest
- [ ] Implement optional detail expanders (room, pot, light, notes, photo)
- [ ] Call AI preview endpoint after species selection
- [ ] Validate inputs and handle inline errors
- [ ] Submit plant to backend and redirect to detail page

## 2. Plant Detail (`/plants/[id]`)
- [ ] Layout hero image, nickname, species, and room badge
- [ ] Display quick stats for last/next watering and cadence
- [ ] Implement tabs for timeline, care plan, photos, notes
- [ ] Add "Mark as watered" and event logging
- [ ] Support schedule adjustments and AI suggestions

## 3. Daily Care – Today (`/today`)
- [ ] Build checklist segmented into overdue, due, and upcoming
- [ ] Implement task cards with quick actions (done, snooze, view)
- [ ] Recompute schedule after marking tasks done
- [ ] Animate task completion and movement between sections

## 4. AI Care Coach
- [ ] Collect environment and history data for suggestions
- [ ] Surface AI nudges at key moments (species select, overdue patterns, weather changes)
- [ ] Allow users to apply or dismiss suggestions and record feedback

## 5. Notifications & Reminders
- [ ] Schedule background job to check due/overdue tasks
- [ ] Send email or push notifications with deep links
- [ ] Add user controls for quiet hours and per‑plant mute

## 6. Logging & Timeline
- [ ] Define event types (watered, fertilized, notes, photos, etc.)
- [ ] Provide entry points for logging from Today and plant detail views
- [ ] Persist events and display them chronologically

## 7. Dashboard & Insights (`/dashboard`)
- [ ] Create widgets for completion rate, overdue trends, and streaks
- [ ] Highlight plants needing attention
- [ ] (Optional) Graph ET₀/weather vs. watering patterns

## 8. Edit & Maintenance
- [ ] Enable editing of plant metadata and hero photo
- [ ] Archive plants or delete with soft‑delete and undo
- [ ] Confirm destructive actions when events exist

## 9. Error & Empty-State Handling
- [ ] Allow free-text species when no match
- [ ] Queue events offline and sync when back online
- [ ] Gracefully handle API errors and missing permissions

## 10. Performance & UX Hygiene
- [ ] Use SSR page shells with suspense for data
- [ ] Cache weather and debounce species search
- [ ] Apply optimistic updates and ensure accessibility standards

## 11. Key Routes & APIs
- [ ] `/today`, `/plants`, `/plants/new`, `/plants/[id]`, `/dashboard`
- [ ] Implement API routes for plants, events, tasks, species search, AI preview, and feedback

## 12. Definition of Done
- [ ] MVP: plant creation with AI preview, Today tasks, basic timeline
- [ ] v0.2: metadata, AI nudges, notifications
- [ ] v1: insights dashboard, import/export, offline queueing

