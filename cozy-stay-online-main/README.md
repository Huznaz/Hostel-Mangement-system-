# CampusStay — Student Hostel Management System

A web application for managing student hostel rooms, applications, and allocations. Built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- **User management**: Student registration/login, profile (student ID, university, phone), admin login via `admin_users`
- **Room management**: Unified room catalog from Supabase, real-time availability, automated allocation (instant confirm + alternative room), manual warden approval
- **Communication**: In-app notifications, student↔management messaging, contact form stored in database
- **Security**: Row-level security, role-based admin routes, audit log of key actions
- **Reports & analytics**: Occupancy reports, financial ledger, CSV exports, dashboard charts
- **Room types**: Dormitories, shared rooms, private rooms, female-only wing, accessible rooms

## Run locally

```sh
cd cozy-stay-online-main
npm install
```

### Separate user and admin apps (recommended)

Run each interface in its own terminal:

```sh
# Terminal 1 — student / public site (port 8080)
npm run dev:user

# Terminal 2 — admin dashboard (port 8081)
npm run dev:admin
```

- **User site:** http://localhost:8080  
- **Admin site:** http://localhost:8081 (sign in with an `admin_users` account)

`npm run dev` is the same as `dev:user`. Admin links on the user site open the admin URL in a new tab when the apps are split.

### Combined app (legacy single server)

```sh
npm run dev:all
```

Serves both public pages and `/admin` on http://localhost:8080.

### Production builds

```sh
npm run build:user   # dist/index.html
npm run build:admin  # dist/admin.html
npm run build:all    # both entry points
```

## Tech stack

- Vite + React + TypeScript
- Supabase (auth, `orders`, `rooms`, `profiles`, `admin_users`, `hotel_settings`)
- TanStack Query, React Router, Recharts

## Branding

Edit `src/constants/brand.ts` to change the hostel name and contact details.

Room catalog: `src/data/hostelData.ts`

## Admin access

Users must have a row in the `admin_users` table (id = their auth user UUID) to access `/admin`.

## Supabase setup (required for new features)

In the Supabase SQL Editor, run scripts in order (see `supabase/README.md`), including **`07_features.sql`** for notifications, messages, audit log, and financial records.

Toggle **Automated allocation** under Admin → Settings → Allocations.
