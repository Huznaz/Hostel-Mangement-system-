-- =============================================================================
-- Upgrade existing CozyStay / hotel database → CampusStay
-- Run this IF you already created tables with your old SQL
-- Then run: 02_policies.sql, 03_seed.sql, 04_admin_user.sql
-- =============================================================================

-- New columns on profiles
alter table public.profiles add column if not exists student_id text;
alter table public.profiles add column if not exists university text;
alter table public.profiles add column if not exists phone text;

-- New columns on orders
alter table public.orders add column if not exists student_id text;
alter table public.orders add column if not exists university text;
alter table public.orders add column if not exists contact_name text;
alter table public.orders add column if not exists contact_email text;
alter table public.orders add column if not exists contact_phone text;

-- Drop FK on orders.user_id if it blocks guest UUID inserts
do $$
declare
  r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid = 'public.orders'::regclass
      and contype = 'f'
      and pg_get_constraintdef(oid) like '%user_id%'
  loop
    execute format('alter table public.orders drop constraint if exists %I', r.conname);
  end loop;
end $$;

-- Optional status check constraint
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'cancelled', 'completed'));

-- Rooms: block column
alter table public.rooms add column if not exists block text;

-- Refresh signup trigger
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

-- updated_at triggers
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

-- CampusStay default settings
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
