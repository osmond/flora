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
create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references public.plants(id) on delete cascade,
  user_id text not null,
  type text not null,
  note text,
  image_url text,
  public_id text,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

drop policy if exists "public read events" on public.events;
drop policy if exists "public write events" on public.events;
drop policy if exists "user read events" on public.events;
drop policy if exists "user insert events" on public.events;
drop policy if exists "user update events" on public.events;
drop policy if exists "user delete events" on public.events;

create policy "user read events" on public.events
  for select using (auth.uid()::text = user_id);

create policy "user insert events" on public.events
  for insert with check (auth.uid()::text = user_id);

create policy "user update events" on public.events
  for update using (auth.uid()::text = user_id);

create policy "user delete events" on public.events
  for delete using (auth.uid()::text = user_id);

-- Helpful indexes
create index if not exists idx_events_plant_created on public.events(plant_id, created_at desc);
create index if not exists idx_rooms_name on public.rooms(name);
