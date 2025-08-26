-- Run this in Supabase SQL editor to set up tasks table

-- Ensure pgcrypto extension
create extension if not exists pgcrypto;

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid references public.plants(id) on delete cascade,
  user_id text not null,
  type text not null,
  due_date date not null,
  completed_at timestamptz,
  snooze_reason text
);

-- Row Level Security
alter table public.tasks enable row level security;
alter table if exists public.tasks add column if not exists user_id text not null default 'flora-single-user';
alter table if exists public.tasks add column if not exists snooze_reason text;

-- Policies: open access for single-user mode
drop policy if exists "public read tasks" on public.tasks;
drop policy if exists "public write tasks" on public.tasks;
drop policy if exists "user read tasks" on public.tasks;
drop policy if exists "user insert tasks" on public.tasks;
drop policy if exists "user update tasks" on public.tasks;
drop policy if exists "user delete tasks" on public.tasks;

create policy "read tasks" on public.tasks
  for select using (true);

create policy "insert tasks" on public.tasks
  for insert with check (true);

create policy "update tasks" on public.tasks
  for update using (true);

create policy "delete tasks" on public.tasks
  for delete using (true);
