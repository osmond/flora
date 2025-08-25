# 🎨 Flora App Design Tasks

This document outlines the **design & UX tasks** needed to bring Flora to life.  
It complements `implementation-tasks.md` by focusing on **look, feel, and interaction polish**.

---

## 0. Foundations

- [ ] **Color System**
  - Audit and finalize HSL tokens in `globals.css`
  - Verify contrast ratios (WCAG AA) in both dark/light
  - Add secondary + accent palettes for states and AI nudges

- [ ] **Typography**
  - Confirm `Inter` as primary font (UI + body)
  - Define size scale: `text-xs → text-2xl`
  - Lock in weights: 400, 500, 600
  - Test headings/subheadings for hierarchy

- [ ] **Spacing & Layout**
  - Establish 4/8/16px spacing rules
  - Apply `max-w-lg` forms, `max-w-6xl` dashboards
  - Ensure consistent `rounded-2xl` (cards) and `rounded-md` (inputs/buttons)

---

## 1. Navigation & Structure

- [ ] **App Shell**
  - Review layout spacing on desktop vs mobile
  - Confirm placement of nav (top or bottom tabs?)
  - Add active state styles to nav links

- [ ] **Theme Switcher**
  - Test light/dark mode toggle
  - Confirm persistence of preference (localStorage or system)

---

## 2. Add a Plant Flow

- [ ] **Form Styling**
  - Input fields: add clear labels, subtle borders, focus ring
  - Buttons: primary = filled, secondary = outline
  - Expanders (room, pot, light): decide between chips vs dropdowns

- [ ] **Species Autosuggest**
  - Style dropdown list (rounded corners, hover state, selected state)
  - Add species thumbnails if API returns images

- [ ] **AI Preview Box**
  - Card-style with secondary background
  - Iconography for water 💧 / sun 🌞 / fert 🌱
  - Collapse/expand animation for preview

---

## 3. Plant Detail Page

- [ ] **Hero Section**
  - Crop hero photo consistently (16:9 or square)
  - Overlay gradient for text legibility
  - Room badge = pill style

- [ ] **Quick Stats**
  - Design stat pills (icon left, label+value stacked)
  - Test layout for 3–4 pills on mobile grid

- [ ] **Tabs**
  - Underline or pill-style nav
  - Smooth transitions between timeline, care, notes, photos

---

## 4. Today View (Tasks)

- [ ] **Task Card**
  - Rounded-2xl, shadow-sm
  - Plant avatar left, text stack middle, action buttons right
  - States: overdue (red), today (green), upcoming (gray)
  - Swipe interactions (done/snooze)

- [ ] **Empty State**
  - Friendly illustration or emoji 🌱
  - “You’re all caught up” message

---

## 5. AI Care Coach

- [ ] **Nudge Card**
  - Left accent border (emerald, amber, or red depending on advice)
  - Iconography: 🌧 humidity, ☀️ light, 🌡 temp
  - Apply/Dismiss buttons styled as secondary/outline

- [ ] **Feedback UX**
  - Toast or subtle checkmark after Apply
  - Dismiss → fade out animation

---

## 6. Dashboard & Insights

- [ ] **Metrics Widgets**
  - Cards with large %/numbers
  - Sparkline graphs (completion over time)
  - Color-coded streaks (green = good, red = broken)

- [ ] **Highlight Plants**
  - Card list with avatar + status
  - Badges: “Needs water”, “Overdue”, “Healthy”

---

## 7. Motion & Microinteractions

- [ ] **Transitions**
  - Form submit → spinner → success check
  - Tab switches → fade/slide

- [ ] **Feedback**
  - Confetti or sparkle animation when streak is achieved
  - Shimmer effect for loading skeletons

---

## 8. Accessibility

- [ ] Add focus-visible rings on all interactive components
- [ ] Screen reader labels for nav, buttons, and plant actions
- [ ] Test keyboard-only navigation
- [ ] Verify dark/light contrasts

---

## 9. Design QA Checklist

- [ ] Typography consistent across all pages
- [ ] Colors consistent with tokens
- [ ] Padding/margins aligned with baseline grid
- [ ] Responsive at `sm`, `md`, `lg` breakpoints
- [ ] Hover/focus/disabled states defined for all buttons/inputs

---
