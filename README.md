# 🌿 Flora – Personalized Plant Care Companion

Flora is a self‑hosted plant care companion that helps you track, understand, and nurture your plants. It combines a clean Next.js UI with Supabase + Prisma for data, optional OpenAI assistance, and a weather‑aware care engine.

---

## 🚀 Features

- 🌱 Add plants with optional AI species autosuggest and an auto‑generated care plan (falls back gracefully if `OPENAI_API_KEY` is not set)
- 🧭 Polished navigation with theme toggle and accessible current‑page highlighting
- 🗂️ Plant collection grouped by room; responsive grid/list views and friendly empty states
- 🪴 Plant + Events APIs for listing, detail, creation, and deletion
- 📝 Log notes, watering/fertilizing, and photos; optimistic updates on detail pages
- 📅 Daily task list generated from each plant’s `waterEvery`/`fertEvery`, with complete/snooze
- 📷 Photo journal and timeline view; suggestions from a simple care coach
- 📍 Environment‑aware schedules with optional weather signal

---

## 🛠️ Tech Stack

- Framework: Next.js 15 (App Router, RSC)
- UI: Tailwind CSS, shadcn/ui, Cabinet Grotesk + Inter
- Data: Supabase (Postgres + Storage) with Prisma ORM
- AI: OpenAI (optional, for suggestions and care plans)
- Weather: Forecast API (optional humidity/ET₀ signal)
- Hosting: Vercel

---

## 📁 Project Structure

- Routes: `src/app/**` (App Router). Public assets in `public/`.
- UI: `src/components/**`; utilities/services in `src/lib/**`.
- Types: `src/types` or `src/types.ts`.
- Data: Prisma schema in `prisma/schema.prisma`; Supabase SQL in `supabase/`.
- Tests: `__tests__/` and `tests/` (Vitest, jsdom). Test setup in `test/setup.ts`.
- Path alias: import app code via `@/*` (configured in `tsconfig.json`).

---

## 📦 Setup

1) Prereqs
- Node 20+, pnpm 8, optional: Supabase CLI, psql

2) Install
```bash
pnpm install
```

3) Environment
- Copy `.env.example` to `.env.local` and set values:
  - `DATABASE_URL` (Postgres connection string)
  - Supabase keys (URL, anon, service role if needed)
  - Optional: `OPENAI_API_KEY`, Cloudinary keys

4) Database
- Option A – Supabase SQL (single‑user mode): apply SQL in `supabase/`.
  - Order: `migrations/20250825045101_rooms_events.sql`, `plants.sql`, `tasks.sql`, `analytics.sql`
  - All scripts are idempotent (safe to re‑run).
  - After applying, refresh schema cache with `select pg_notify('pgrst','reload schema');` (or restart API).
- Option B – Prisma migrations + seed (if your `DATABASE_URL` points to Postgres):
```bash
pnpm prisma migrate dev
pnpm db:seed
```

5) Run
```bash
pnpm dev
```

---

## 🧪 Testing & Lint

- Lint: `pnpm lint`
- Unit tests: `pnpm test` • Watch: `pnpm test:watch` • UI: `pnpm test:ui`
- Coverage: `pnpm test:coverage` (reports in `coverage/`)
- E2E placeholder: `pnpm e2e` (runs via Vitest in CI)

Testing uses Vitest + Testing Library (jsdom). Mocks for `next/navigation` live in `test/setup.ts`.

---

## 📜 Scripts

- Dev server: `pnpm dev` • Build: `pnpm build` • Start: `pnpm start`
- DB seed: `pnpm db:seed`
- Reminders (example script): `pnpm reminders:send`

---

## 🔒 Security & Config

- Never commit secrets. Use `.env.local` (ignored by Git). See `.env.example` for required keys.
- Use server‑only keys (e.g., Supabase service role) only in server code under `src/lib/**`.

---

## 🤝 Contributing

- Conventional Commits (`feat:`, `fix:`, `chore:`…). Keep subjects ≤ 72 chars.
- CI runs lint, unit, and e2e tests (`.github/workflows/ci.yml`).
- Vercel preview deploys on PRs (`.github/workflows/vercel-preview.yml`).
- See `docs/contributing.md` and the design [style guide](./docs/style-guide.md).

---

## 📘 Documentation

- Style guide: `docs/style-guide.md`
- Architecture: `docs/architecture.md`
- Roadmap: `docs/roadmap.md`

---

## 📄 License

MIT © Jonathan Osmond
