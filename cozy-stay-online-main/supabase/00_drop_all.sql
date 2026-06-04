-- =============================================================================
-- CampusStay — DROP everything (public schema app objects)
-- ⚠️  WARNING: Deletes ALL room applications, rooms, settings, and profiles.
--     Does NOT delete auth login accounts (auth.users stay).
--
-- Run this ONCE in Supabase SQL Editor, then run:
--   01_schema.sql → 02_policies.sql → 03_seed.sql → 04_admin_user.sql
-- =============================================================================

-- Remove from Realtime (ignore errors if not added)
do $$
begin
  alter publication supabase_realtime drop table public.orders;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime drop table public.rooms;
exception when others then null;
end $$;

-- Triggers
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists profiles_updated_at on public.profiles;
drop trigger if exists orders_updated_at on public.orders;

-- Tables (CASCADE drops RLS policies on these tables)
drop table if exists public.orders cascade;
drop table if exists public.admin_users cascade;
drop table if exists public.profiles cascade;
drop table if exists public.hotel_settings cascade;
drop table if exists public.rooms cascade;

-- Functions
drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;
