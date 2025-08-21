-- Run this in Supabase SQL editor to set up analytics events table

create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text not null,
  payload jsonb,
  created_at timestamptz default now()
);

alter table public.analytics_events enable row level security;

drop policy if exists "user read analytics_events" on public.analytics_events;
create policy "user read analytics_events" on public.analytics_events
  for select using (auth.uid()::text = user_id);

drop policy if exists "user insert analytics_events" on public.analytics_events;
create policy "user insert analytics_events" on public.analytics_events
  for insert with check (auth.uid()::text = user_id);
