# Velo Motors

A complete dealership web application: React + TypeScript + Tailwind CSS on the
frontend, Supabase (Postgres + Auth + Storage + Row Level Security) on the backend.

This is real, runnable code — not a mockup. Nothing will load data until you
connect it to your own Supabase project (steps below), because a live
database has to live somewhere with your credentials, not mine.

## 1. Create a Supabase project

1. Go to https://supabase.com and sign up (free tier is enough to launch on).
2. Click **New Project**. Pick a name, a database password (save it), and a region.
3. Wait for provisioning (~2 minutes).

## 2. Create the database tables + security policies

1. In your project, open **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/schema.sql` and click **Run**.
   This creates every table (`profiles`, `vehicles`, `vehicle_images`,
   `favorites`, `test_drive_requests`, `inquiries`, `sell_requests`), enables
   Row Level Security on all of them, creates the `is_admin()` helper, and
   sets up a trigger that auto-creates a `profiles` row on signup.

## 3. Enable email authentication

1. Go to **Authentication → Providers**.
2. Confirm **Email** is enabled (it is by default).
3. Under **Authentication → URL Configuration**, set your **Site URL** (your
   deployed domain, or `http://localhost:5173` while developing) and add
   `/reset-password` to **Redirect URLs** — this is where the password-reset
   email link lands.
4. Optional: **Authentication → Email Templates** to customize the
   confirmation/reset emails' look.

## 4. Create the storage bucket

`schema.sql` already creates the `vehicle-images` bucket and its policies —
nothing else to do here. Confirm it exists under **Storage** in the dashboard.

## 5. Seed demo vehicles

1. Back in **SQL Editor → New query**, paste `supabase/seed.sql` and run it.
2. This inserts the 12 demo vehicles (Mercedes GLE, BMW X5, Land Cruiser,
   Lexus RX, Range Rover Sport, C-Class, 5 Series, Camry, Accord, Cayenne,
   Q8, Model Y) with a placeholder photo each. Replace photos with real ones
   from **Admin → Vehicles → Edit** once you're logged in as an admin.

## 6. Get your API keys

**Project Settings → API**. You need:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon public key** → `VITE_SUPABASE_ANON_KEY`

Never use the **service_role** key in frontend code — it bypasses RLS entirely.

## 7. Configure environment variables

```
cp .env.example .env
```
Fill in:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_WHATSAPP_NUMBER=15551234567   # country code + number, no + or spaces
```

## 8. Install and run locally

```
npm install
npm run dev
```
Open the printed localhost URL.

## 9. Create your first admin account

1. In the running app, click **Create Account** and register normally —
   every signup becomes a `customer` by default, on purpose (no one can make
   themselves an admin from the UI).
2. In Supabase **SQL Editor**, run:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```
3. Log out and back in. You'll now see **Admin Dashboard** in the account menu.

## 10. Deploy it for real

This is a static Vite build talking directly to Supabase, so any static host works:

**Vercel / Netlify (recommended)**
1. Push this folder to a GitHub repo.
2. Import it in Vercel or Netlify.
3. Build command: `npm run build` — Output directory: `dist`
4. Add the same three env vars from step 7 in the host's dashboard.
5. Deploy. You get a real public URL.

**Netlify Drop (fastest, no git needed)**
1. Run `npm run build` locally.
2. Drag the generated `dist/` folder onto https://app.netlify.com/drop
   Note: env vars must be set at build time, so this only works if you build
   locally with your `.env` already filled in — Netlify Drop can't inject
   them after the fact.

## What's real vs. what to expand

Fully wired to Supabase: auth (signup/login/logout/password reset), customer
profiles, vehicle inventory with search/filter/sort/pagination, vehicle
detail pages, image gallery + upload/reorder/delete, favorites, comparison
(up to 3, session-based), test drive requests, inquiries, sell-your-car
submissions, the full admin CRUD dashboard, and RLS enforcing customer vs.
admin access at the database level — not just hidden UI.

Left as clearly-labeled placeholders, since they need accounts/services only
you can provision: the Google Maps embed on `/contact` (currently a labeled
placeholder box), and real photo upload on the public `/sell-your-car` form
(the admin vehicle form's uploader is fully functional — the public seller
form captures listing details only, pending you wiring up a public-facing
storage path if you want that).

## Project structure

```
src/
  components/   Navbar, Footer, VehicleCard, FilterPanel, FinancingCalculator,
                FavoriteButton, ComparisonBar, ProtectedRoute, AdminRoute, ...
  pages/        Home, Inventory, VehicleDetail, Login, Register, Account,
                Favorites, Compare, SellYourCar, Services, About, Contact
  pages/admin/  AdminLayout, AdminDashboard, AdminVehicles, AdminVehicleForm,
                AdminCustomers, AdminTestDrives, AdminInquiries, AdminSellRequests
  context/      AuthContext, ThemeContext, CompareContext
  hooks/        useVehicles (search/filter/sort/pagination against Supabase)
  lib/          supabase.ts (client + WhatsApp link helper)
  types/        shared TypeScript types matching the database schema
supabase/
  schema.sql    tables, RLS policies, storage bucket, triggers
  seed.sql      12 demo vehicles
```
