# 🌿 Flora

Flora is a personalized plant care companion built with Next.js and Supabase. It helps you track your plants and their care needs.

## Features

- Add plants with a nickname and species auto‑suggest.
- Optional photo upload stored in a public Supabase bucket.
- View a simple list of saved plants.

## Development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env.local` with the following keys:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   SUPABASE_SERVICE_ROLE_KEY=
   PERENUAL_API_KEY=
   TREFLE_API_KEY=
   ```

3. In Supabase, run the SQL in `supabase/plants.sql` to create tables, policies, and the `plant-photos` storage bucket.

4. Start the development server:

   ```bash
   pnpm dev
   ```

Then open [http://localhost:3000](http://localhost:3000) to view the app.

=======
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

