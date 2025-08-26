-- Run this in Supabase SQL editor to set up analytics events table

create extension if not exists pgcrypto;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default 'flora-single-user',
  type text not null,
  payload jsonb,
  created_at timestamptz default now()
);

alter table if exists public.analytics_events
  add column if not exists user_id text not null default 'flora-single-user';

alter table public.analytics_events enable row level security;

drop policy if exists "user read analytics_events" on public.analytics_events;
drop policy if exists "user insert analytics_events" on public.analytics_events;

create policy "read analytics_events" on public.analytics_events
  for select using (true);

create policy "insert analytics_events" on public.analytics_events
  for insert with check (true);
