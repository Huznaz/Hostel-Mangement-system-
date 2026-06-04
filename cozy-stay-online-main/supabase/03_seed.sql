-- =============================================================================
-- CampusStay — Default settings & sample rooms
-- =============================================================================

insert into public.hotel_settings (key, value) values
  ('hotel_name', 'CampusStay'),
  ('hotel_email', 'admin@campusstay.ac.ke'),
  ('hotel_phone', '+254 769 505 440'),
  ('hotel_address', 'Nairobi, Kenya'),
  ('check_in_time', '10:00'),
  ('check_out_time', '10:00'),
  ('min_advance_days', '7'),
  ('max_advance_days', '365'),
  ('payment_cash', 'true'),
  ('payment_mpesa', 'true'),
  ('payment_card', 'false'),
  ('cancellation_policy', '48'),
  ('currency', 'KSH')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();

-- Sample rooms (skip if you already have rows)
insert into public.rooms (name, description, price, capacity, size, breakfast, pets, featured, type, block, amenities, images)
select * from (values
  (
    'Block A — 6-Bed Dorm',
    'Shared dormitory with locker, study lamp, and shared bathroom.',
    4500, 1, 18, true, false, true, 'Dormitory', 'Block A',
    array['Personal Locker', 'Study Desk', 'WiFi', 'Shared Bathroom', '24/7 Security'],
    array['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=75&fm=webp']
  ),
  (
    'Block B — 4-Bed Dorm',
    'Smaller dorm wing with fewer beds per room.',
    5500, 1, 16, true, false, true, 'Dormitory', 'Block B',
    array['Locker', 'WiFi', 'Shared Bathroom', 'Common Kitchen'],
    array['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=75&fm=webp']
  ),
  (
    'Female-Only Dorm — Block C',
    'Secure female-only dormitory with dedicated warden.',
    5000, 1, 17, true, false, true, 'Female Dorm', 'Block C',
    array['Female-Only Wing', 'Locker', 'WiFi', 'Warden on Duty'],
    array['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=75&fm=webp']
  ),
  (
    'Twin Sharing Room',
    'Two students share one room with twin beds.',
    7500, 2, 14, true, true, true, 'Shared Room', 'Block D',
    array['Twin Beds', 'Private Bathroom', 'Desk per Bed', 'WiFi'],
    array['https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop&q=75&fm=webp']
  ),
  (
    'Private Single Room',
    'Private room for one student.',
    9500, 1, 12, true, true, true, 'Private Room', 'Block E',
    array['Single Bed', 'Private Bathroom', 'Study Desk', 'WiFi'],
    array['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=75&fm=webp']
  )
) as v(name, description, price, capacity, size, breakfast, pets, featured, type, block, amenities, images)
where not exists (select 1 from public.rooms limit 1);
