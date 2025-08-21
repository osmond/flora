# Flora

Flora is a personalized plant care companion built with Next.js and Supabase.

## Features

- Add plants with species autosuggest.
- View a list of all saved plants.
- Open a plant to see its detail page with a timeline of care events.

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

## Roadmap

See [ROADMAP.md](ROADMAP.md) for planned and in‑progress work.
