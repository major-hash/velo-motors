-- ============================================================
-- VELO MOTORS — Supabase schema, RLS policies, storage, triggers
-- Run this whole file once in the Supabase SQL Editor
-- (Project > SQL Editor > New query > paste > Run).
-- ============================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------- ROLE ENUM ----------
do $$ begin
  create type user_role as enum ('customer', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type vehicle_status as enum ('available', 'reserved', 'sold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type request_status as enum ('pending', 'confirmed', 'completed', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inquiry_status as enum ('new', 'contacted', 'resolved');
exception when duplicate_object then null; end $$;

do $$ begin
  create type sell_status as enum ('new', 'reviewing', 'contacted', 'completed', 'declined');
exception when duplicate_object then null; end $$;

-- ---------- PROFILES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null,
  phone text,
  avatar_url text,
  role user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email, 'customer');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------- VEHICLES ----------
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  year int not null,
  trim text,
  price numeric not null,
  mileage int not null default 0,
  condition text not null default 'Used',
  body_type text not null,
  fuel_type text not null default 'Gasoline',
  transmission text not null default 'Automatic',
  drivetrain text not null default 'FWD',
  engine text,
  horsepower int,
  exterior_color text not null default '',
  interior_color text,
  description text,
  stock_number text not null unique,
  vin text not null unique,
  status vehicle_status not null default 'available',
  featured boolean not null default false,
  features jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_vehicles_status on vehicles(status);
create index if not exists idx_vehicles_make on vehicles(make);
create index if not exists idx_vehicles_featured on vehicles(featured);

-- ---------- VEHICLE IMAGES ----------
create table if not exists vehicle_images (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_vehicle_images_vehicle on vehicle_images(vehicle_id);

-- ---------- FAVORITES ----------
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, vehicle_id)
);

-- ---------- TEST DRIVE REQUESTS ----------
create table if not exists test_drive_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_date date not null,
  preferred_time text not null,
  message text,
  status request_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- INQUIRIES ----------
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  subject text not null default 'General inquiry',
  message text not null,
  status inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- SELL REQUESTS ----------
create table if not exists sell_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text not null,
  make text not null,
  model text not null,
  year int not null,
  mileage int not null,
  condition text not null,
  asking_price numeric not null,
  location text not null,
  description text,
  status sell_status not null default 'new',
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table vehicle_images enable row level security;
alter table favorites enable row level security;
alter table test_drive_requests enable row level security;
alter table inquiries enable row level security;
alter table sell_requests enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- ---------- profiles ----------
create policy "profiles_select_own_or_admin" on profiles for select
  using (auth.uid() = id or is_admin());
create policy "profiles_update_own" on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id and role = (select role from profiles where id = auth.uid()));
create policy "profiles_admin_update_any" on profiles for update
  using (is_admin());

-- ---------- vehicles (public read, admin write) ----------
create policy "vehicles_public_read" on vehicles for select using (true);
create policy "vehicles_admin_insert" on vehicles for insert with check (is_admin());
create policy "vehicles_admin_update" on vehicles for update using (is_admin());
create policy "vehicles_admin_delete" on vehicles for delete using (is_admin());

-- ---------- vehicle_images (public read, admin write) ----------
create policy "vehicle_images_public_read" on vehicle_images for select using (true);
create policy "vehicle_images_admin_insert" on vehicle_images for insert with check (is_admin());
create policy "vehicle_images_admin_update" on vehicle_images for update using (is_admin());
create policy "vehicle_images_admin_delete" on vehicle_images for delete using (is_admin());

-- ---------- favorites ----------
create policy "favorites_select_own_or_admin" on favorites for select
  using (auth.uid() = user_id or is_admin());
create policy "favorites_insert_own" on favorites for insert
  with check (auth.uid() = user_id);
create policy "favorites_delete_own" on favorites for delete
  using (auth.uid() = user_id);

-- ---------- test_drive_requests ----------
create policy "test_drives_select_own_or_admin" on test_drive_requests for select
  using (auth.uid() = user_id or is_admin());
create policy "test_drives_insert_own" on test_drive_requests for insert
  with check (auth.uid() = user_id);
create policy "test_drives_admin_update" on test_drive_requests for update
  using (is_admin());

-- ---------- inquiries ----------
-- Anonymous visitors can submit inquiries (contact form) so user_id may be null;
-- select is restricted to the owning user (if any) or admins.
create policy "inquiries_select_own_or_admin" on inquiries for select
  using (auth.uid() = user_id or is_admin());
create policy "inquiries_insert_any" on inquiries for insert
  with check (user_id is null or auth.uid() = user_id);
create policy "inquiries_admin_update" on inquiries for update
  using (is_admin());

-- ---------- sell_requests ----------
create policy "sell_requests_select_own_or_admin" on sell_requests for select
  using (auth.uid() = user_id or is_admin());
create policy "sell_requests_insert_any" on sell_requests for insert
  with check (user_id is null or auth.uid() = user_id);
create policy "sell_requests_admin_update" on sell_requests for update
  using (is_admin());

-- ============================================================
-- STORAGE — vehicle images bucket
-- ============================================================
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

create policy "vehicle_images_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "vehicle_images_bucket_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'vehicle-images' and is_admin());

create policy "vehicle_images_bucket_admin_update"
  on storage.objects for update
  using (bucket_id = 'vehicle-images' and is_admin());

create policy "vehicle_images_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'vehicle-images' and is_admin());

-- ============================================================
-- FIRST ADMIN
-- Register a normal account in the app first, then run this
-- (swap in that account's email) to promote it to admin:
--
--   update profiles set role = 'admin' where email = 'you@example.com';
-- ============================================================
