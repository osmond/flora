# 🗂️ Handoff Notes

## Directory Overview

```
/app
  page.tsx             # Root dashboard
  today/page.tsx       # Today's tasks
  plants/[id]/page.tsx # Plant detail
  add/page.tsx         # Add plant flow

/components
  plant/    # Plant-specific UI
  layout/   # Header, nav, etc
  ui/       # Shared primitives (Card, Button, etc)

/lib
  supabase/ # Supabase helpers
  utils.ts  # Shared utilities

/public     # App assets (logo, favicon, etc)
/styles     # Tailwind + global CSS
/supabase   # SQL schema and seed files
```

## Database

The project uses Supabase for Postgres, auth, and storage.
Schema, policies, and seed data are stored as raw SQL in `/supabase`:

- `plants.sql` – plants and species tables with RLS policies
- `tasks.sql` – care task table and policies
- `supabase/migrations/20250825045101_rooms_events.sql` – rooms and events tables with RLS policies
- `analytics.sql` – analytics events table
- `sample_data.sql` – optional seed data for plants and tasks

Apply the SQL with the Supabase CLI:

```bash
supabase db execute supabase/plants.sql
supabase db execute supabase/tasks.sql
supabase db execute supabase/migrations/20250825045101_rooms_events.sql
supabase db execute supabase/analytics.sql
supabase db execute supabase/sample_data.sql # optional seed data
```

After executing the SQL files, Supabase's schema cache must be refreshed with `select pg_notify('pgrst','reload schema');` or by restarting the API.

