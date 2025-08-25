-- Rooms table
create table if not exists public.rooms (
  id bigserial primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

-- Plants: add room_id if missing
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'plants' and column_name = 'room_id'
  ) then
    alter table public.plants add column room_id bigint references public.rooms(id) on delete set null;
  end if;
end $$;

-- Events table (care timeline)
create table if not exists public.events (
  id bigserial primary key,
  plant_id bigint not null references public.plants(id) on delete cascade,
  type text not null check (type in ('watered','fertilized','misted','rotated','repotted','pruned','note','photo')),
  amount numeric null,
  note text null,
  photo_url text null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_events_plant_created on public.events(plant_id, created_at desc);
create index if not exists idx_rooms_name on public.rooms(name);
