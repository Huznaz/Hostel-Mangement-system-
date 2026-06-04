-- =============================================================================
-- CampusStay — Notifications, messaging, audit log, financial records
-- Run after 01_schema.sql and 02_policies.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Notifications
-- -----------------------------------------------------------------------------
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  title text not null,
  body text not null default '',
  type text not null default 'system'
    check (type in ('allocation', 'message', 'payment', 'system')),
  link text,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

create index if not exists notifications_user_id_idx on public.notifications (user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Messages (student ↔ management)
-- -----------------------------------------------------------------------------
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  from_user_id uuid,
  to_user_id uuid,
  subject text not null,
  body text not null,
  sender_name text,
  sender_email text,
  is_read boolean default false not null,
  created_at timestamptz default now() not null
);

comment on column public.messages.to_user_id is 'Null = message to admin inbox';
comment on column public.messages.from_user_id is 'Null = anonymous contact form';

create index if not exists messages_inbox_idx on public.messages (to_user_id, created_at desc);
create index if not exists messages_from_idx on public.messages (from_user_id, created_at desc);

-- -----------------------------------------------------------------------------
-- Audit log (security / access control trail)
-- -----------------------------------------------------------------------------
create table if not exists public.audit_log (
  id uuid default gen_random_uuid() primary key,
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

-- -----------------------------------------------------------------------------
-- Financial records
-- -----------------------------------------------------------------------------
create table if not exists public.financial_records (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders (id) on delete set null,
  user_id uuid,
  amount numeric not null,
  payment_method text,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'refunded', 'cancelled')),
  reference text,
  notes text,
  recorded_by uuid,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

drop trigger if exists financial_records_updated_at on public.financial_records;
create trigger financial_records_updated_at
  before update on public.financial_records
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Settings: automated allocation
-- -----------------------------------------------------------------------------
insert into public.hotel_settings (key, value) values
  ('auto_allocate', 'true')
on conflict (key) do nothing;

-- -----------------------------------------------------------------------------
-- Notify students when allocation status changes
-- -----------------------------------------------------------------------------
create or replace function public.notify_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and old.status is distinct from new.status
     and new.user_id is distinct from '00000000-0000-0000-0000-000000000000'::uuid then
    insert into public.notifications (user_id, title, body, type, link)
    values (
      new.user_id,
      'Allocation ' || initcap(new.status),
      'Your application for ' || new.room_name || ' is now ' || new.status || '.',
      'allocation',
      '/profile'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists orders_notify_status on public.orders;
create trigger orders_notify_status
  after update of status on public.orders
  for each row execute function public.notify_order_status_change();

-- -----------------------------------------------------------------------------
-- Financial record when allocation confirmed
-- -----------------------------------------------------------------------------
create or replace function public.create_financial_record_on_confirm()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE'
     and old.status is distinct from new.status
     and new.status = 'confirmed'
     and not exists (
       select 1 from public.financial_records fr where fr.order_id = new.id
     ) then
    insert into public.financial_records (
      order_id, user_id, amount, payment_method, status, notes
    ) values (
      new.id,
      new.user_id,
      new.total_price,
      coalesce(new.payment_method, 'pay_at_hostel'),
      'pending',
      'Auto-created on allocation confirmation'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists orders_financial_on_confirm on public.orders;
create trigger orders_financial_on_confirm
  after update of status on public.orders
  for each row execute function public.create_financial_record_on_confirm();

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
alter table public.notifications enable row level security;
alter table public.messages enable row level security;
alter table public.audit_log enable row level security;
alter table public.financial_records enable row level security;

-- notifications
drop policy if exists "Users read own notifications" on public.notifications;
create policy "Users read own notifications" on public.notifications
  for select using (auth.uid() = user_id);

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications" on public.notifications
  for update using (auth.uid() = user_id);

drop policy if exists "Users insert own notifications" on public.notifications;
create policy "Users insert own notifications" on public.notifications
  for insert with check (auth.uid() = user_id);

drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications" on public.notifications
  for all using (exists (select 1 from public.admin_users where id = auth.uid()));

-- messages
drop policy if exists "Users read own messages" on public.messages;
create policy "Users read own messages" on public.messages
  for select using (
    auth.uid() = from_user_id or auth.uid() = to_user_id
  );

drop policy if exists "Users send messages" on public.messages;
create policy "Users send messages" on public.messages
  for insert with check (
    auth.uid() = from_user_id
    or (auth.uid() is null and from_user_id is null)
  );

drop policy if exists "Users mark messages read" on public.messages;
create policy "Users mark messages read" on public.messages
  for update using (
    auth.uid() = to_user_id or auth.uid() = from_user_id
  );

drop policy if exists "Admins manage messages" on public.messages;
create policy "Admins manage messages" on public.messages
  for all using (exists (select 1 from public.admin_users where id = auth.uid()));

-- audit_log (admin only)
drop policy if exists "Admins read audit log" on public.audit_log;
create policy "Admins read audit log" on public.audit_log
  for select using (exists (select 1 from public.admin_users where id = auth.uid()));

drop policy if exists "Admins insert audit log" on public.audit_log;
create policy "Admins insert audit log" on public.audit_log
  for insert with check (
    exists (select 1 from public.admin_users where id = auth.uid())
    or auth.uid() = actor_id
  );

drop policy if exists "Authenticated insert own audit" on public.audit_log;
create policy "Authenticated insert own audit" on public.audit_log
  for insert with check (auth.uid() = actor_id);

-- financial_records
drop policy if exists "Users read own financial records" on public.financial_records;
create policy "Users read own financial records" on public.financial_records
  for select using (auth.uid() = user_id);

drop policy if exists "Admins manage financial records" on public.financial_records;
create policy "Admins manage financial records" on public.financial_records
  for all using (exists (select 1 from public.admin_users where id = auth.uid()));

-- profiles: allow upsert on first save
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);
