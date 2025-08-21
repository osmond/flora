-- Sample data for plants and tasks
-- Run this in Supabase SQL editor after creating tables

-- Insert sample plants
insert into public.plants (id, user_id, name, species, common_name, room)
values
  ('00000000-0000-0000-0000-000000000001', 'flora-single-user', 'Aloe Vera', 'Aloe vera', 'Aloe', 'Living Room'),
  ('00000000-0000-0000-0000-000000000002', 'flora-single-user', 'Fiddle Leaf Fig', 'Ficus lyrata', 'Fiddle Leaf Fig', 'Office'),
  ('00000000-0000-0000-0000-000000000003', 'flora-single-user', 'Monstera', 'Monstera deliciosa', 'Swiss Cheese Plant', 'Bedroom'),
  ('00000000-0000-0000-0000-000000000004', 'flora-single-user', 'Snake Plant', 'Sansevieria trifasciata', 'Snake Plant', 'Hallway'),
  ('00000000-0000-0000-0000-000000000005', 'flora-single-user', 'Spider Plant', 'Chlorophytum comosum', 'Spider Plant', 'Kitchen'),
  ('00000000-0000-0000-0000-000000000006', 'flora-single-user', 'Peace Lily', 'Spathiphyllum', 'Peace Lily', 'Bathroom'),
  ('00000000-0000-0000-0000-000000000007', 'flora-single-user', 'ZZ Plant', 'Zamioculcas zamiifolia', 'ZZ Plant', 'Office'),
  ('00000000-0000-0000-0000-000000000008', 'flora-single-user', 'Pothos', 'Epipremnum aureum', 'Pothos', 'Living Room'),
  ('00000000-0000-0000-0000-000000000009', 'flora-single-user', 'Rubber Plant', 'Ficus elastica', 'Rubber Plant', 'Dining Room'),
  ('00000000-0000-0000-0000-000000000010', 'flora-single-user', 'Philodendron', 'Philodendron hederaceum', 'Heartleaf Philodendron', 'Bedroom'),
  ('00000000-0000-0000-0000-000000000011', 'flora-single-user', 'Jade Plant', 'Crassula ovata', 'Jade Plant', 'Office'),
  ('00000000-0000-0000-0000-000000000012', 'flora-single-user', 'Boston Fern', 'Nephrolepis exaltata', 'Boston Fern', 'Bathroom'),
  ('00000000-0000-0000-0000-000000000013', 'flora-single-user', 'Chinese Evergreen', 'Aglaonema', 'Chinese Evergreen', 'Hallway'),
  ('00000000-0000-0000-0000-000000000014', 'flora-single-user', 'Dracaena', 'Dracaena marginata', 'Dragon Tree', 'Living Room'),
  ('00000000-0000-0000-0000-000000000015', 'flora-single-user', 'English Ivy', 'Hedera helix', 'English Ivy', 'Kitchen'),
  ('00000000-0000-0000-0000-000000000016', 'flora-single-user', 'Bird of Paradise', 'Strelitzia reginae', 'Bird of Paradise', 'Sunroom'),
  ('00000000-0000-0000-0000-000000000017', 'flora-single-user', 'Bamboo Palm', 'Chamaedorea seifrizii', 'Bamboo Palm', 'Office'),
  ('00000000-0000-0000-0000-000000000018', 'flora-single-user', 'Croton', 'Codiaeum variegatum', 'Croton', 'Living Room'),
  ('00000000-0000-0000-0000-000000000019', 'flora-single-user', 'Prayer Plant', 'Maranta leuconeura', 'Prayer Plant', 'Bedroom'),
  ('00000000-0000-0000-0000-000000000020', 'flora-single-user', 'Succulent Mix', 'Various', 'Succulent Mix', 'Desk')
on conflict (id) do nothing;

-- Insert sample tasks (overdue, due today, upcoming)
insert into public.tasks (id, plant_id, user_id, type, due_date)
values
  -- Overdue tasks
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'flora-single-user', 'Water', current_date - interval '6 day'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'flora-single-user', 'Fertilize', current_date - interval '5 day'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'flora-single-user', 'Prune', current_date - interval '4 day'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000004', 'flora-single-user', 'Mist', current_date - interval '3 day'),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000005', 'flora-single-user', 'Water', current_date - interval '2 day'),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000006', 'flora-single-user', 'Rotate', current_date - interval '1 day'),
  -- Due today
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000007', 'flora-single-user', 'Water', current_date),
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000008', 'flora-single-user', 'Fertilize', current_date),
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000009', 'flora-single-user', 'Prune', current_date),
  ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000010', 'flora-single-user', 'Repot', current_date),
  ('00000000-0000-0000-0001-000000000011', '00000000-0000-0000-0000-000000000011', 'flora-single-user', 'Mist', current_date),
  ('00000000-0000-0000-0001-000000000012', '00000000-0000-0000-0000-000000000012', 'flora-single-user', 'Rotate', current_date),
  ('00000000-0000-0000-0001-000000000013', '00000000-0000-0000-0000-000000000013', 'flora-single-user', 'Inspect', current_date),
  -- Upcoming
  ('00000000-0000-0000-0001-000000000014', '00000000-0000-0000-0000-000000000014', 'flora-single-user', 'Water', current_date + interval '1 day'),
  ('00000000-0000-0000-0001-000000000015', '00000000-0000-0000-0000-000000000015', 'flora-single-user', 'Fertilize', current_date + interval '2 day'),
  ('00000000-0000-0000-0001-000000000016', '00000000-0000-0000-0000-000000000016', 'flora-single-user', 'Prune', current_date + interval '3 day'),
  ('00000000-0000-0000-0001-000000000017', '00000000-0000-0000-0000-000000000017', 'flora-single-user', 'Repot', current_date + interval '4 day'),
  ('00000000-0000-0000-0001-000000000018', '00000000-0000-0000-0000-000000000018', 'flora-single-user', 'Mist', current_date + interval '5 day'),
  ('00000000-0000-0000-0001-000000000019', '00000000-0000-0000-0000-000000000019', 'flora-single-user', 'Rotate', current_date + interval '6 day'),
  ('00000000-0000-0000-0001-000000000020', '00000000-0000-0000-0000-000000000020', 'flora-single-user', 'Inspect', current_date + interval '7 day')
on conflict (id) do nothing;

