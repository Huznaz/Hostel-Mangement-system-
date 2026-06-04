-- =============================================================================
-- Enable Realtime (optional — run if live updates on rooms/orders do not work)
-- Dashboard → Database → Replication may also be used in the UI
-- =============================================================================

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.rooms;
