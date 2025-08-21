-- Run this in Supabase SQL editor (your project's DB)

-- Enable pgcrypto for gen_random_uuid if not already
create extension if not exists pgcrypto;

-- Plants table
create table if not exists public.plants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null,
  common_name text,
  image_url text,
  care_plan jsonb,
  created_at timestamptz default now()
);

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

-- Policies: open read/write (safe for single-user dev)
drop policy if exists "public read plants" on public.plants;
create policy "public read plants" on public.plants
  for select using (true);

drop policy if exists "public write plants" on public.plants;
create policy "public write plants" on public.plants
  for insert with check (true);

drop policy if exists "public read species" on public.species;
create policy "public read species" on public.species
  for select using (true);

drop policy if exists "public write species" on public.species;
create policy "public write species" on public.species
  for insert with check (true);

-- Public storage bucket for plant photos
insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

-- Optional starter species
insert into public.species (scientific_name, common_name, family)
values
  ('Aloe vera', 'Aloe', 'Asphodelaceae'),
  ('Ficus lyrata', 'Fiddle Leaf Fig', 'Moraceae'),
  ('Monstera deliciosa', 'Swiss Cheese Plant', 'Araceae');
