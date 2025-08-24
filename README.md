# 🌿 Flora – Personalized Plant Care Companion

Flora is your intelligent, self-hosted plant care companion.
It helps you track, understand, and nurture your plants with ease.

Powered by Supabase, OpenAI, and a weather-aware care engine,
Flora creates personalized care plans and adapts them to your environment.

---

## 🚀 Features

- 🌱 **Add a Plant**
  - Smart species autosuggest (via OpenAI API)
  - Auto-generated AI care plan
  - Room assignment & environment tagging

- 📅 **Care Dashboard**
  - Today, Overdue, and Upcoming tasks
  - Swipe to mark tasks complete

- 🪴 **Plant Detail Pages**
  - Hero image, Quick Stats, Timeline
  - Notes, Photos, and Coach suggestions

- 📷 **Photo Journal**
  - Upload progress photos for each plant

- 🧠 **Care Coach** *(Coming Soon)*
  - AI-based suggestions when care is overdue or inconsistent

- 📍 **Environment-aware Schedules**
  - Uses location and weather APIs to adjust care intervals

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 w/ App Router, Server Components, Turbopack
- **UI**: Tailwind CSS, shadcn/ui, Cabinet Grotesk + Inter fonts
- **Database**: Supabase (Postgres + Auth + Storage)
- **AI**: OpenAI (for species suggestions & care plan generation)
- **Weather**: Forecast API (local humidity, ET₀ support)
- **Hosting**: Vercel

---

## 🗃️ Database

All schema, policies, and seed data live as SQL in [`/supabase`](./supabase).

- `plants.sql` – plants and species tables with RLS policies
- `tasks.sql` – care task table and policies
- `events.sql` – user event log
- `analytics.sql` – analytics events table
- `sample_data.sql` – optional seed data for plants and tasks

---

## 📦 Setup
Copy `.env.example` to `.env.local` and fill in your Supabase, OpenAI, Cloudinary, and optional auth credentials.


```bash
git clone https://github.com/osmond/flora.git
cd flora
pnpm install

cp .env.example .env.local  # Fill in your keys
# apply schema (requires Supabase CLI)
supabase db execute supabase/plants.sql
supabase db execute supabase/tasks.sql
supabase db execute supabase/events.sql
supabase db execute supabase/analytics.sql

# optional sample data
supabase db execute supabase/sample_data.sql

# optional Prisma demo data
pnpm db:seed

pnpm dev
```

See `/docs/deployment.md` for full production deployment steps.

---

## 🤝 Contributing

See `/docs/contributing.md` to get started with local development and best practices.

---

## 📘 Documentation

- [`/docs/style-guide.md`](./docs/style-guide.md) – UI/UX guidelines
- [`/docs/roadmap.md`](./docs/roadmap.md) – Upcoming features
- [`/docs/architecture.md`](./docs/architecture.md) – Tech architecture

---

## 📄 License

MIT © Jonathan Osmond
