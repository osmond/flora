-- Run this in Supabase SQL editor to set up tasks table

-- Ensure pgcrypto extension
create extension if not exists pgcrypto;

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references public.plants(id) on delete cascade,
  type text not null,
  due_date date not null,
  completed_at timestamptz
);

-- Row Level Security
alter table public.tasks enable row level security;

-- Policies: open read/write for development
drop policy if exists "public read tasks" on public.tasks;
create policy "public read tasks" on public.tasks
  for select using (true);

drop policy if exists "public write tasks" on public.tasks;
create policy "public write tasks" on public.tasks
  for insert with check (true);
