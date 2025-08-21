# Flora

Flora is a personalized plant care companion built with Next.js and Supabase.

## Features

- Add plants with species autosuggest, room suggestions, optional photo uploads, pot size/material/light level/drainage/soil/indoor–outdoor fields, and automatic geolocation + local humidity capture.
- Assign plants to rooms and view them grouped by room.
- Toggle between list and grid views when browsing plants.
- If you have no plants yet, a friendly CTA helps you add your first one.
- Open a plant to see its detail page with a photo hero and timeline of care events.
- Jot down freeform notes on each plant's detail page.
- Upload additional photos and view them in a gallery on each plant's detail page.
- See quick stats for each plant's care plan, including watering schedule and last/next watering dates.
- Edit a plant's care plan from its detail page.
- Get gentle Care Coach suggestions when a plant's watering is overdue.
- Review overdue, today, and upcoming care tasks on `/today`.
- Swipe a task right to mark it done or left to snooze it on the Today page.
- Enjoy a subtle fade-out animation when completing tasks.
- Celebrate completed tasks with a cheerful leaf emoji.
- Cached data fetching with friendly loading states on list pages.
- Generate an AI-powered care plan when creating a plant.
- Care plan suggestions now factor in real-time local weather data.
- Care plan suggestions now incorporate your climate zone.
- Polished UI with Inter typography and improved form interactions.
- Saving a plant now shows a success toast and redirects to its detail page.
- Switch between light and dark themes with a simple toggle.
- Optional HTTP Basic Auth to gate access when deploying.
- Export your plant data in JSON or CSV via `/api/export?format=csv`.
- Restore plant data by POSTing exported JSON to `/api/import`.

## Development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Set the following environment variables in `.env.local` to connect to Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BASIC_AUTH_USER` (optional)
- `BASIC_AUTH_PASSWORD` (optional)

Create a storage bucket named `plant-photos` in your Supabase project to store uploaded plant images.

### Sample data

To quickly try Flora with some example plants and tasks, run the SQL in
[`supabase/sample_data.sql`](supabase/sample_data.sql) against your Supabase
database after creating the tables.

### Authentication

Flora currently runs in a single-user mode and skips Supabase Auth. Set
`NEXT_PUBLIC_SINGLE_USER_ID` to control which user ID is used in database
queries. Database rows in `plants` and `tasks` are now protected with
row-level security scoped to this ID, so be sure to run the SQL setup files in
`supabase/` on your project. See [docs/auth.md](docs/auth.md) for more details
on the decision and future plans. When `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD`
are set, all routes are protected with simple HTTP Basic Auth.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned and in‑progress work.
