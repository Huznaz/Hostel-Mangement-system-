# CampusStay — Supabase database setup

Run these scripts in the **Supabase Dashboard → SQL Editor**, in order.

| Order | File | When to use |
|-------|------|-------------|
| 0 | `00_drop_all.sql` | **Only if** you want a clean slate (deletes all app data) |
| 1 | `01_schema.sql` | New project, or first-time setup |
| 2 | `02_policies.sql` | Always run after schema (safe to re-run) |
| 3 | `03_seed.sql` | Default settings + sample rooms |
| 4 | `04_admin_user.sql` | Make yourself admin (edit email first) |
| 5 | `05_realtime.sql` | Enable live updates (optional) |
| 6 | `06_fix_room_images.sql` | **Admin images blank?** Updates room photo URLs in the database |
| 7 | `07_features.sql` | **Required** — notifications, messages, audit log, financial records, auto-allocation setting |

If you **already ran** the old hotel SQL and want a **fresh start**, run `00_drop_all.sql` then `01_schema.sql` → `02` → `03` → `04`.

If you want to **keep existing data**, use `upgrade_from_hotel.sql` instead of `00_drop_all` + `01_schema`.

## Notes

- Table name `hotel_settings` is kept so the app works without code changes; defaults use **CampusStay**.
- `orders.user_id` has **no FK** to `auth.users` so guest applications using the placeholder UUID (`00000000-…`) do not fail. Signed-in students should use their real `auth.uid()`.
- Enable **Realtime** on `orders` and `rooms` in Database → Replication if live updates do not appear.
- The **public site** loads rooms from the `rooms` table (falls back to `hostelData.ts` if empty). Run `03_seed.sql` for sample rooms.
- **Automated allocation**: set `auto_allocate` in Admin → Settings → Allocations (stored in `hotel_settings`).

## After running SQL

1. Sign up in the app with your student email.
2. Run `04_admin_user.sql` with your email.
3. Open `/admin` in the app.
