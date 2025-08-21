# 🌿 Flora App Roadmap

Flora is a personalized plant care companion for one user — you. It aims to make plant tracking effortless and emotionally resonant, powered by AI-generated care plans and a delightful UI.

---

## ✅ Phase 0 – Setup & Foundations

- [x] Create new Next.js app (`app/flora`)
- [x] Connect Supabase for database
  - [x] `plants` table
- [x] Add environment keys (`.env`)
- [x] Basic app layout with routing (`/app`, `/app/plants/[id]`, etc.)
- [x] Set up local dev

---

## 🌱 Phase 1 – Add a Plant Flow

> Goal: “From curious plant person to confident caretaker — in under a minute.”

- [x] **Identify**
  - [x] Plant nickname
  - [x] Species autosuggest (Perenual API)
  - [x] Optional photo upload

- [x] **Place**
  - [x] Room selector or creator

- [x] **Describe**
  - [x] Pot size + material
  - [x] Light level
  - [x] Drainage quality
  - [x] Soil type
  - [x] Indoor/outdoor
  - [x] Local humidity + lat/lon (for climate context)

- [x] **Care Plan**
   - [x] Call `/api/ai-care` to get AI-generated defaults (watering interval, amount, fertilizer needs)
 

  - [x] **Confirm**
    - [x] Save plant to Supabase
    - [x] Show success toast + redirect to detail view

---

## 🌿 Phase 2 – Plant Detail Page

> A visually rich, emotionally resonant view of each plant.

- [x] Photo + Name hero section
- [x] Quick Stats: care plan values, last watered, next due
- [x] Timeline of logged events (watering, fertilizing, notes)
- [x] Notes section (freeform journaling)
- [x] Photo gallery
- [x] Edit button for care plan

---

## 📋 Phase 3 – Plants List

- [x] Room view: show each room and its plants as image tiles
- [x] Empty state CTA: “Add your first plant”
- [x] Grid or list toggle
- [x] Tap = go to plant detail

---

## 📅 Phase 4 – Care Task Dashboard

- [x] “Today” view: show plants needing care today
- [x] Show overdue, due today, and upcoming
- [x] Swipe to mark as done and swipe to snooze


---

- [x] Add Row-Level Security (RLS) to `plants` and `tasks`
- [x] Protect routes (e.g. `/app`)

---

## 🧠 Phase 6 – Smart Enhancements

- [ ] Improve AI-generated care plan with:
  - [x] Real weather data
  - [x] Climate zone inference
  - [ ] Historical behavior
- [ ] Dynamic care plan updates
  - Re-run AI-care weekly or when humidity, season, or repeated snoozes suggest adjustments
- [x] “Care coach” suggestions on plant detail page
- [ ] Timeline trend insights (“you’ve watered 5 days late lately…”)

---

## 🧪 Phase 7 – Polish & UX

 - [x] Dark mode toggle
 - [x] Animations (task done, photo upload, etc.)
 - [x] Cache API calls + loading states
 - [x] Micro-interactions (emoji feedback when completing tasks)
 - [ ] Care badges

---

## 📦  Backup & Export

- [x] Export all plant data to JSON or CSV
- [x] Import feature for recovery

---

## 📊 Data & Insights

- [ ] Plant History View: compact changelog like "Renamed from Lily to Kay", "Light level changed from Low → Medium", and "Updated care plan from 5 to 10 days".
- [ ] Water Usage Chart: track watering volume or frequency per plant and per room to spot outliers and visualize effort.

---

## 🧭 Next Steps

- [x] Wrap up Plant Detail timeline view
- [x] Build Rooms + Plant List page
- [x] Add `/app/today` for task view
- [x] Evaluate Supabase Auth vs hardcoded single-user fallback
- [x] Polish visual style, typography, and interactions
