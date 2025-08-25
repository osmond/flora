-- Run this in Supabase SQL editor to set up events table

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

-- Ensure column exists for existing installations
alter table if exists public.events
  add column if not exists image_url text,
  add column if not exists public_id text,
  add column if not exists user_id text not null default 'flora-single-user';
