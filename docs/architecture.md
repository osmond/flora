# 🗂️ Handoff Notes

## Directory Overview

```
src/app
  layout.tsx        # Root layout
  page.tsx          # Root dashboard
  today/page.tsx    # Today's tasks

src/components
  SpeciesAutosuggest.tsx  # Species search component
  plant/                  # Plant-specific UI
  ui/                     # Shared primitives (Card, Button, etc)

src/lib
  analytics.ts        # Analytics helpers
  auth.ts             # Auth helpers
  config.ts           # Project config
  supabase/           # Supabase helpers
  supabaseAdmin.ts    # Supabase admin utilities

src/libs
  apis/               # External API clients

src/types
  event.ts            # Event types
  plant.ts            # Plant types

public    # App assets (logo, favicon, etc)
supabase  # SQL schema and seed files
```

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

