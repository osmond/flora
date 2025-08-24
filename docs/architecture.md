# 🗂️ Handoff Notes

## Directory Overview

```
/app
  layout.tsx           # Application layout
  page.tsx             # Root dashboard
  today/page.tsx       # Today's tasks

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

Future routes (planned):
- `/app/plants/[id]/page.tsx` – Plant detail
- `/app/add/page.tsx` – Add plant flow

## Database

The project uses Supabase for Postgres, auth, and storage.
Schema, policies, and seed data are stored as raw SQL in `/supabase`:

- `plants.sql` – plants and species tables with RLS policies
- `tasks.sql` – care task table and policies
- `events.sql` – user event log
- `analytics.sql` – analytics events table
- `sample_data.sql` – optional seed data for plants and tasks

Apply the SQL with the Supabase CLI:

```bash
supabase db execute supabase/plants.sql
supabase db execute supabase/tasks.sql
supabase db execute supabase/events.sql
supabase db execute supabase/analytics.sql
supabase db execute supabase/sample_data.sql # optional seed data
```

