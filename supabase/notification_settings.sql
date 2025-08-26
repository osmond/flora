-- Run in Supabase SQL editor to manage notification preferences

create table if not exists public.notification_settings (
  user_id text primary key,
  quiet_start time,
  quiet_end time,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.notification_settings enable row level security;

drop policy if exists "user read notification_settings" on public.notification_settings;
drop policy if exists "user upsert notification_settings" on public.notification_settings;
drop policy if exists "user update notification_settings" on public.notification_settings;

create policy "user read notification_settings" on public.notification_settings
  for select using (auth.uid()::text = user_id);

create policy "user upsert notification_settings" on public.notification_settings
  for insert with check (auth.uid()::text = user_id);

create policy "user update notification_settings" on public.notification_settings
  for update using (auth.uid()::text = user_id);
