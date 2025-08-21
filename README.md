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
- Review overdue, today, and upcoming care tasks on `/today`.
- Generate an AI-powered care plan when creating a plant.
- Polished UI with Inter typography and improved form interactions.
- Saving a plant now shows a success toast and redirects to its detail page.

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

Create a storage bucket named `plant-photos` in your Supabase project to store uploaded plant images.

### Authentication

Flora currently runs in a single-user mode and skips Supabase Auth.  You can
optionally set `NEXT_PUBLIC_SINGLE_USER_ID` to control which user ID is used
in database queries.  See [docs/auth.md](docs/auth.md) for more details on the
decision and future plans.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned and in‑progress work.
