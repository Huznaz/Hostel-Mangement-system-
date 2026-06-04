-- =============================================================================
-- CampusStay — Row Level Security policies (safe to re-run)
-- =============================================================================

-- ---------- profiles ----------
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles" on public.profiles
  for select using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- ---------- orders (allocations) ----------
drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own orders" on public.orders;
create policy "Users can insert own orders" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own orders" on public.orders;
create policy "Users can update own orders" on public.orders
  for update using (auth.uid() = user_id);

-- Guest / anonymous application (app uses zero UUID when not logged in)
drop policy if exists "Anonymous guest applications" on public.orders;
create policy "Anonymous guest applications" on public.orders
  for insert with check (
    auth.uid() is null
    and user_id = '00000000-0000-0000-0000-000000000000'::uuid
  );

-- Public availability: read active allocations (room_id + dates only in practice)
drop policy if exists "Public read active orders for availability" on public.orders;
create policy "Public read active orders for availability" on public.orders
  for select using (status in ('pending', 'confirmed'));

-- Admin: full access to allocations
drop policy if exists "Admins can view all orders" on public.orders;
create policy "Admins can view all orders" on public.orders
  for select using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

drop policy if exists "Admins can update all orders" on public.orders;
create policy "Admins can update all orders" on public.orders
  for update using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

drop policy if exists "Admins can delete orders" on public.orders;
create policy "Admins can delete orders" on public.orders
  for delete using (
    exists (select 1 from public.admin_users where id = auth.uid())
  );

-- ---------- admin_users ----------
drop policy if exists "Anyone can check admin status" on public.admin_users;
create policy "Anyone can check admin status" on public.admin_users
  for select using (true);

-- ---------- hotel_settings ----------
drop policy if exists "Admin full access" on public.hotel_settings;
drop policy if exists "Admins manage hotel_settings" on public.hotel_settings;
create policy "Admins manage hotel_settings" on public.hotel_settings
  for all
  using (exists (select 1 from public.admin_users where id = auth.uid()))
  with check (exists (select 1 from public.admin_users where id = auth.uid()));

-- ---------- rooms ----------
drop policy if exists "Public read" on public.rooms;
create policy "Public read" on public.rooms
  for select using (true);

drop policy if exists "Admin write" on public.rooms;
create policy "Admin write" on public.rooms
  for all
  using (exists (select 1 from public.admin_users where id = auth.uid()))
  with check (exists (select 1 from public.admin_users where id = auth.uid()));
