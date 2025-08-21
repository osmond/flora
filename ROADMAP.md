# 🌿 Flora App Roadmap

Flora is a personalized plant care companion for one user — you. It aims to make plant tracking effortless and emotionally resonant, powered by AI-generated care plans and a delightful UI.

---

## ✅ Phase 0 – Setup & Foundations

- [ x] Create new Next.js app (`app/flora`)
- [x ] Connect Supabase for database
  - [ ] `plants` table
- [ x] Add environment keys (`.env`)
- [ ] Basic app layout with routing (`/app`, `/app/plants/[id]`, etc.)
- [x ] Set up local dev 

---

## 🌱 Phase 1 – Add a Plant Flow

> Goal: “From curious plant person to confident caretaker — in under a minute.”

- [ ] **Identify**
  - [x] Plant nickname
  - [x] Species autosuggest (Perenual API)
  - [x] Optional photo upload

- [ ] **Place**
  - [x] Room selector or creator

- [ ] **Describe**
  - [x] Pot size + material
  - [x] Light level
  - [x] Drainage quality
  - [ ] Soil type
  - [ ] Indoor/outdoor
  - [ ] Local humidity + lat/lon (for climate context)

- [ ] **Care Plan**
  - [ ] Call `/api/ai-care` to get AI-generated defaults (watering interval, amount, fertilizer needs)
 

- [ ] **Confirm**
  - [ ] Save plant to Supabase
  - [ ] Show success toast + redirect to detail view

---

## 🌿 Phase 2 – Plant Detail Page

> A visually rich, emotionally resonant view of each plant.

- [ ] Photo + Name hero section
- [ ] Quick Stats: care plan values, last watered, next due
- [x] Timeline of logged events (watering, fertilizing, notes)
- [x] Notes section (freeform journaling)
- [ ] Photo gallery
- [ ] Edit button for care plan

---

## 📋 Phase 3 – Plants List

- [ ] Room view: show each room and its plants as image tiles
- [ ] Empty state CTA: “Add your first plant”
- [ ] Grid or list toggle (mobile-first)
- [ ] Tap = go to plant detail

---

## 📅 Phase 4 – Care Task Dashboard

- [ ] “Today” view: show plants needing care today
- [ ] Show overdue, due today, and upcoming
- [ ] Swipe to mark as done


---

- [ ] Add Row-Level Security (RLS) to `plants` and `tasks`
- [ ] Protect routes (e.g. `/app`)

---

## 🧠 Phase 6 – Smart Enhancements

- [ ] Improve AI-generated care plan with:
  - [ ] Real weather data
  - [ ] Climate zone inference
  - [ ] Historical behavior
- [ ] “Care coach” suggestions on plant detail page
- [ ] Timeline trend insights (“you’ve watered 5 days late lately…”)

---

## 🧪 Phase 7 – Polish & UX

- [ ] Mobile layout refinements
- [ ] Dark mode toggle
- [ ] Animations (task done, photo upload, etc.)
- [ ] Cache API calls + loading states
- [ ] Micro-interactions (emoji feedback, care badges)

---

## 📦  Backup & Export

- [ ] Export all plant data to JSON or CSV
- [ ] Import feature for recovery

---

## 🧭 Next Steps

- [x] Wrap up Plant Detail timeline view
- [x] Build Rooms + Plant List page
- [x] Add `/app/today` for task view
- [x] Evaluate Supabase Auth vs hardcoded single-user fallback
- [x] Polish visual style, typography, and interactions
