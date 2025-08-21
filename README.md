# Flora

Flora is a personalized plant care companion built with Next.js and Supabase.

## Features

- Add plants with species autosuggest.
- Assign plants to rooms and view them grouped by room.
- Open a plant to see its detail page with a timeline of care events.
- Jot down freeform notes on each plant's detail page.
- Check today's care tasks on `/today`.

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

### Authentication

Flora currently runs in a single-user mode and skips Supabase Auth.  You can
optionally set `NEXT_PUBLIC_SINGLE_USER_ID` to control which user ID is used
in database queries.  See [docs/auth.md](docs/auth.md) for more details on the
decision and future plans.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned and in‑progress work.
