# 🌿 Flora App Roadmap

Flora is a personalized plant care companion for a single user. It helps track plants, generate smart care plans, and log daily tasks—wrapped in a visually calm and emotionally supportive interface.

This roadmap outlines upcoming development phases across both functionality and UI/UX polish.

---

## ✅ Phase 0 – Foundations (Complete)
- [x] Project Init: Next.js App Router, Tailwind, shadcn/ui
- [x] Data Layer: Supabase project, `.env` integration
- [x] ORM: Prisma set up with Plant, Room, CareEvent, Photo, Note models
- [x] AI / APIs: Connected OpenAI API for species suggestions
- [x] Style Guide: Color palette, fonts, layout principles documented in `/docs`
- [x] Docs: `/roadmap.md`, `/style-guide.md`, `/README.md` complete

---

## 🌱 Phase 1 – Add a Plant Flow (Mostly Complete)
**Goal:** “From curious plant person to confident caretaker — in under a minute.”

### Completed
- [x] Multi-step form with nickname, species autosuggest (OpenAI), pot size, room assignment, photo (optional), drainage, soil, humidity, light, etc.
- [x] Smart AI care plan generation (mocked)
- [x] Local form state management + strong types

### To Finish
 - [x] Submit form → create plant in Supabase
- [x] Redirect to `/plants/[id]`
 - [x] Fallback when no species selected
- [ ] Light UI polish: spacing, transitions, preview step

---

## 🪴 Phase 2 – Plant List & Detail Views
**Goal:** Effortless overview of your collection and details at a glance.

### `/app/plants`
- [x] Grid and list toggle
- [x] Group plants by Room
- [x] Show photo thumbnails and nicknames
- [x] Handle "no plants" state with friendly CTA

### `/app/plants/[id]`
 - [x] Hero Section: cover photo or placeholder
 - [x] Quick Stats: next/last watering, schedule, fertilizing
 - [x] Timeline View: care events sorted by date (styled vertical feed)
 - [x] Notes: freeform journaling
 - [x] Gallery: uploaded photos of the plant
  - [x] Care Coach: context-aware suggestions (e.g., "Looks overdue for watering")

### To Build
- [x] Supabase queries for plant list and detail views
 - [x] Supabase writes for care logs (water/fertilize)
 - [x] Prisma queries for photos and updates
- [ ] Optimistic updates on log creation
- [ ] Responsive styling (mobile first, then tablet/desktop)

---

## 📅 Phase 3 – Care Task Engine + Daily View
**Goal:** Know what to do today—and feel great when you do it.

### `/app/today`
- [ ] Task List: water/fertilizer/note tasks grouped by date
- [ ] Swipe right: mark as done
- [ ] Swipe left: defer/reschedule
- [ ] Quick-add logs from the task

### Task Engine Logic
- [ ] Use `waterEvery` and `fertEvery` intervals
- [ ] Schedule CareEvents per plant
- [ ] Hydrate timeline from completed + upcoming tasks
- [ ] Timezone-aware comparisons (`dayjs` or `date-fns`)

### AI Enhancements
- [ ] Coach suggests “you may want to water early due to low humidity”
- [ ] Long-term: ET₀ model integration

---



## ✨ Phase 4 – Visual Polish & Delight
**Goal:** Feel good using it.

### Design Tweaks
- [ ] Animate “Mark as Done” feedback (confetti, pulse, or sparkles)
- [ ] Variable font-weight pulsing on active tasks
- [ ] Swipe card transitions
- [ ] Soothing sound on task complete (optional)



### Responsive Testing
- [ ] Tune layout for iPad/tablet
- [ ] Dark mode polish
- [ ] Offline support (optional)

---

## 🔮 Phase 6 – Future Ideas (Exploration Only)
- [ ] AI-powered photo insights (e.g., "looks dry")
- [ ] Weekly care forecast with weather integration
- [ ] Cloud sync or backup
- [ ] AI care plan that evolves over time
- [ ] PWA installable version (Add to Home Screen)

---

## 🧾 Task Backlog Snapshot (In No Order)
- [ ] Submit Add Plant form to Supabase
- [ ] `/plants` grid & list toggle
- [ ] `/plants/[id]` view with timeline & stats
- [ ] Swipe to mark care task complete
- [ ] Watering logic engine based on intervals
- [x] Prisma `seed.ts` file for demo data
 - [x] File upload to Cloudinary
- [ ] RLS policies for Supabase
- [ ] Responsive testing (mobile/tablet/desktop)
- [x] Timeline component polish (grouped by date)
- [x] Setup `@/lib/db.ts` for Prisma client

---

## 📘 Related Docs
- `/docs/roadmap.md` — Matches this plan
- `/docs/style-guide.md` — UI tokens, fonts, color


