-- Run this in Supabase SQL editor (your project's DB)

-- Enable pgcrypto for gen_random_uuid if not already
create extension if not exists pgcrypto;

-- Plants table
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  room_id bigint references public.rooms(id),
  user_id text not null,
  nickname text not null,
  species_scientific text not null,
  species_common text,
  pot_size text,
  pot_material text,
  drainage text,
  soil_type text,
  light_level text,
  indoor text,
  humidity text,
  image_url text,
  care_plan jsonb,
  created_at timestamptz default now()
);

-- Ensure columns exist for existing installations
-- Rename legacy columns to canonical names
alter table if exists public.plants rename column name to nickname;
alter table if exists public.plants rename column species to species_scientific;
alter table if exists public.plants rename column common_name to species_common;
alter table if exists public.plants drop column if exists room;

-- Ensure columns exist for existing installations
alter table if exists public.plants add column if not exists room_id bigint references public.rooms(id);
alter table if exists public.plants add column if not exists species_common text;
alter table if exists public.plants add column if not exists species_scientific text;
alter table if exists public.plants add column if not exists nickname text;
alter table if exists public.plants add column if not exists image_url text;
alter table if exists public.plants add column if not exists pot_size text;
alter table if exists public.plants add column if not exists pot_material text;
alter table if exists public.plants add column if not exists drainage text;
alter table if exists public.plants add column if not exists soil_type text;
alter table if exists public.plants add column if not exists light_level text;
alter table if exists public.plants add column if not exists indoor text;
alter table if exists public.plants add column if not exists humidity text;
alter table if exists public.plants add column if not exists user_id text not null default 'flora-single-user';

-- Species table
create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  scientific_name text not null,
  common_name text,
  family text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.plants enable row level security;
alter table public.species enable row level security;

-- Policies: user-specific access to plants
drop policy if exists "public read plants" on public.plants;
drop policy if exists "public write plants" on public.plants;
drop policy if exists "user read plants" on public.plants;
drop policy if exists "user insert plants" on public.plants;
drop policy if exists "user update plants" on public.plants;
drop policy if exists "user delete plants" on public.plants;

create policy "user read plants" on public.plants
  for select using (auth.uid()::text = user_id);

create policy "user insert plants" on public.plants
  for insert with check (auth.uid()::text = user_id);

create policy "user update plants" on public.plants
  for update using (auth.uid()::text = user_id);

create policy "user delete plants" on public.plants
  for delete using (auth.uid()::text = user_id);

-- Species remain open for reads/writes
drop policy if exists "public read species" on public.species;
create policy "public read species" on public.species
  for select using (true);

drop policy if exists "public write species" on public.species;
create policy "public write species" on public.species
  for insert with check (true);

-- Optional starter species
insert into public.species (scientific_name, common_name, family)
values
  ('Aloe vera', 'Aloe', 'Asphodelaceae'),
  ('Ficus lyrata', 'Fiddle Leaf Fig', 'Moraceae'),
  ('Monstera deliciosa', 'Swiss Cheese Plant', 'Araceae');
