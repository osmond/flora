-- Run this in Supabase SQL editor to set up events table

create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references public.plants(id) on delete cascade,
  type text not null,
  note text,
  image_url text,
  image_public_id text,
  created_at timestamptz default now()
);

alter table public.events enable row level security;

drop policy if exists "public read events" on public.events;
create policy "public read events" on public.events
  for select using (true);

drop policy if exists "public write events" on public.events;
create policy "public write events" on public.events
  for insert with check (true);

drop policy if exists "public delete events" on public.events;
create policy "public delete events" on public.events
  for delete using (true);

-- Ensure column exists for existing installations
alter table if exists public.events
  add column if not exists image_url text;
alter table if exists public.events
  add column if not exists image_public_id text;
