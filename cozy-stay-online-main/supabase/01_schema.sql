-- =============================================================================
-- CampusStay Student Hostel — Schema (fresh install)
-- Run in Supabase SQL Editor. Skip if tables already exist; use upgrade_from_hotel.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  username text,
  avatar_url text,
  student_id text,
  university text,
  phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- -----------------------------------------------------------------------------
-- Room allocations / applications (table name kept: orders)
-- -----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  room_id integer not null,
  room_name text not null,
  check_in_date text not null,
  check_out_date text not null,
  guests integer not null default 1,
  total_price numeric not null,
  status text default 'pending' not null
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_method text,
  special_requests text,
  student_id text,
  university text,
  contact_name text,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

comment on table public.orders is 'Student room applications / allocations';
comment on column public.orders.check_in_date is 'Move-in date (YYYY-MM-DD)';
comment on column public.orders.check_out_date is 'Move-out date (YYYY-MM-DD)';
comment on column public.orders.guests is 'Number of students in the allocation';

-- -----------------------------------------------------------------------------
-- Admin users
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid references auth.users on delete cascade primary key,
  created_at timestamptz default now() not null
);

-- -----------------------------------------------------------------------------
-- Hostel settings (key kept as hotel_* for app compatibility)
-- -----------------------------------------------------------------------------
create table if not exists public.hotel_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now() not null
);

-- -----------------------------------------------------------------------------
-- Rooms (managed in admin; public catalog may also use hostelData.ts)
-- -----------------------------------------------------------------------------
create table if not exists public.rooms (
  id bigint generated always as identity primary key,
  name text not null,
  description text default '',
  price numeric not null default 0,
  images text[] default '{}',
  capacity integer default 1,
  size integer default 0,
  breakfast boolean default false,
  pets boolean default false,
  featured boolean default false,
  type text default 'Dormitory',
  block text,
  amenities text[] default '{}',
  created_at timestamptz default now() not null
);

comment on column public.rooms.breakfast is 'Meals plan included';
comment on column public.rooms.pets is 'Private bathroom (repurposed flag in UI)';
comment on column public.rooms.block is 'Hostel block e.g. Block A';

-- -----------------------------------------------------------------------------
-- updated_at trigger helper
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Auto-create profile on signup
-- -----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, new.raw_user_meta_data->>'email')
  )
  on conflict (id) do update set
    username = coalesce(excluded.username, public.profiles.username),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Enable RLS
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.admin_users enable row level security;
alter table public.hotel_settings enable row level security;
alter table public.rooms enable row level security;
