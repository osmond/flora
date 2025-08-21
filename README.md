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

