create table if not exists public.nexus_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.nexus_courses (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, description text, progress integer not null default 0 check(progress between 0 and 100), credits numeric not null default 3,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.nexus_projects (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, description text, status text not null default 'active', url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.nexus_experiments (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, notes text, status text not null default 'queued',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.nexus_notes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null, body text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.nexus_profiles enable row level security;
alter table public.nexus_courses enable row level security;
alter table public.nexus_projects enable row level security;
alter table public.nexus_experiments enable row level security;
alter table public.nexus_notes enable row level security;

create policy "profiles own" on public.nexus_profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "courses own" on public.nexus_courses for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "projects own" on public.nexus_projects for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "experiments own" on public.nexus_experiments for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "notes own" on public.nexus_notes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.nexus_profiles, public.nexus_courses, public.nexus_projects, public.nexus_experiments, public.nexus_notes to authenticated;
