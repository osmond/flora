-- Sample data for plants and tasks
-- Run this in Supabase SQL editor after creating tables

-- Insert sample plants
insert into public.plants (id, user_id, name, species, common_name, room)
values
  ('11111111-1111-1111-1111-111111111111', 'flora-single-user', 'Aloe Vera', 'Aloe vera', 'Aloe', 'Living Room'),
  ('22222222-2222-2222-2222-222222222222', 'flora-single-user', 'Fiddle Leaf Fig', 'Ficus lyrata', 'Fiddle Leaf Fig', 'Office'),
  ('33333333-3333-3333-3333-333333333333', 'flora-single-user', 'Monstera', 'Monstera deliciosa', 'Swiss Cheese Plant', 'Bedroom')
on conflict (id) do nothing;

-- Insert sample tasks (overdue, due today, upcoming)
insert into public.tasks (id, plant_id, user_id, type, due_date)
values
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'flora-single-user', 'Water', current_date - interval '1 day'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '22222222-2222-2222-2222-222222222222', 'flora-single-user', 'Fertilize', current_date),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '33333333-3333-3333-3333-333333333333', 'flora-single-user', 'Repot', current_date + interval '3 day')
on conflict (id) do nothing;
