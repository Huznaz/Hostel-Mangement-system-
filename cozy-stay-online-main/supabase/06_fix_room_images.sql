-- =============================================================================
-- Fix room image URLs in Supabase (admin dashboard uses this table)
-- Run in SQL Editor if admin cards show blank/broken images
-- =============================================================================

update public.rooms set images = array[
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=75&fm=webp'
] where name ilike '%Block A%' or id = 1;

update public.rooms set images = array[
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=75&fm=webp'
] where name ilike '%Block B%' or id = 2;

update public.rooms set images = array[
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=75&fm=webp',
  'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&auto=format&fit=crop&q=75&fm=webp'
] where name ilike '%Female-Only%' or name ilike '%Block C%' or id = 3;

update public.rooms set images = array[
  'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop&q=75&fm=webp',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=75&fm=webp'
] where name ilike '%Twin Sharing%' or id = 4;

update public.rooms set images = array[
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=75&fm=webp',
  'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&auto=format&fit=crop&q=75&fm=webp'
] where name ilike '%Private Single%' or id = 5;
