-- Habitus: database schema for Supabase (replaces the Base44 backend).
-- Run once in Supabase → SQL Editor, or with `supabase db push`.
--
-- Every table keeps the field names the app already uses (id, created_date,
-- updated_date, created_by) so the React code works unchanged.
-- Row Level Security (RLS) is ON for every table:
--   * personal tables: each user sees and edits only their own rows;
--   * catalog tables (experts, library...): every signed-in user can read,
--     only admins can write.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Users (mirror of auth.users with app role/status)
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('admin', 'user')),
  status text not null default 'active' check (status in ('active', 'suspended')),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

-- Admin check used by the policies. SECURITY DEFINER so it can read
-- public.users without being blocked by its own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

-- Create the public.users row when someone signs up (email or Google).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.users enable row level security;

create policy "users: read own row or admin" on public.users
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Only admins change role/status. Normal users cannot promote themselves.
create policy "users: admin update" on public.users
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Shared helpers: timestamps and ownership
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_date()
returns trigger
language plpgsql
as $$
begin
  new.updated_date := now();
  return new;
end;
$$;

-- Fills owner_id / created_by on insert. An admin may create a row for
-- another user by passing created_by = that user's email (AdminUsers page).
create or replace function public.set_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target uuid;
begin
  if new.created_by is not null
     and new.created_by is distinct from (auth.jwt() ->> 'email')
     and public.is_admin() then
    select id into target from public.users where email = new.created_by;
    if target is null then
      raise exception 'Unknown user %', new.created_by;
    end if;
    new.owner_id := target;
  else
    new.owner_id := auth.uid();
    new.created_by := auth.jwt() ->> 'email';
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Personal tables (owner only)
-- ---------------------------------------------------------------------------
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  title text not null,
  description text,
  category text not null default 'routine'
    check (category in ('focus', 'exercise', 'mindfulness', 'study', 'routine', 'social')),
  frequency text default 'daily' check (frequency in ('daily', 'weekly', 'custom')),
  icon text,
  color text,
  time_slot text default 'all_day' check (time_slot in ('morning', 'afternoon', 'evening', 'all_day')),
  streak double precision default 0,
  best_streak double precision default 0,
  total_completions double precision default 0,
  xp_per_completion double precision default 10,
  grace_days_used double precision default 0,
  is_active boolean default true,
  sort_order double precision default 0
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  completed_date date not null,
  xp_earned double precision default 10,
  notes text
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  role text not null default 'user' check (role in ('user', 'assistant', 'idea')),
  content text not null
);

create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  message text not null,
  category text default 'motivation' check (category in ('insight', 'motivation', 'warning', 'celebration')),
  context_summary text,
  is_read boolean default false
);

create table public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  log_date date not null,
  bathroom_visits double precision default 0,
  wake_time text,
  water_glasses double precision default 0,
  calories double precision default 0,
  activity_minutes double precision default 0,
  mood text default 'ok' check (mood in ('great', 'good', 'ok', 'low', 'bad')),
  todo_text text,
  improvement_text text
);

create table public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  week_key text not null,
  summary_text text,
  xp_total double precision default 0,
  completions double precision default 0,
  active_days double precision default 0,
  best_habit text
);

create table public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  total_xp double precision default 0,
  level double precision default 1,
  badges jsonb default '[]'::jsonb,
  longest_streak double precision default 0,
  focus_minutes double precision default 0,
  exercise_minutes double precision default 0,
  photo_url text,
  bg_color text,
  language text default 'it' check (language in ('it', 'en', 'ko')),
  plan text default 'free' check (plan in ('free', 'premium')),
  evening_mode boolean default false
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  expert_id text not null,
  expert_name text,
  session_date timestamptz not null,
  mode text default 'video' check (mode in ('video', 'audio')),
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  price double precision default 0
);

-- ---------------------------------------------------------------------------
-- Catalog tables (read: any signed-in user, write: admin)
-- ---------------------------------------------------------------------------
create table public.experts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  name text not null,
  title text,
  specialty text not null default 'adhd_coach'
    check (specialty in ('adhd_coach', 'psychologist', 'psychiatrist', 'therapist', 'neurologist')),
  bio text,
  photo_url text,
  price double precision default 40,
  rating double precision default 5,
  reviews double precision default 0,
  language text default 'it' check (language in ('it', 'en', 'ko')),
  online_available boolean default true,
  available boolean default true
);

create table public.specialists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  name text not null,
  title text,
  specialty text not null
    check (specialty in ('psychiatrist', 'psychologist', 'neurologist', 'adhd_coach', 'therapist')),
  bio text,
  photo_url text,
  email text,
  phone text,
  availability text,
  rating double precision,
  specializations jsonb default '[]'::jsonb,
  location text,
  online_available boolean default true
);

create table public.training_programs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  title text not null,
  description text,
  category text not null check (category in ('physical', 'mental', 'study', 'focus', 'meditation')),
  difficulty text default 'beginner' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration_minutes double precision,
  xp_reward double precision default 25,
  steps jsonb default '[]'::jsonb,
  icon text
);

create table public.library_contents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete set null,
  created_by text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now(),
  title text not null,
  category text not null default 'mindset'
    check (category in ('neuroscienza', 'produttivita', 'mindset', 'emozioni', 'studio')),
  language text default 'it' check (language in ('it', 'en', 'ko')),
  duration_minutes double precision default 3,
  emoji text default '🌿',
  summary text,
  body text,
  is_premium boolean default false
);

-- ---------------------------------------------------------------------------
-- Triggers, indexes and policies for all data tables
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'habits', 'habit_logs', 'ai_messages', 'coach_messages', 'daily_metrics',
    'weekly_summaries', 'user_profiles', 'bookings',
    'experts', 'specialists', 'training_programs', 'library_contents'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create trigger %I before insert on public.%I for each row execute function public.set_owner()', t || '_set_owner', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.touch_updated_date()', t || '_touch', t);
    execute format('create index %I on public.%I (owner_id)', t || '_owner_idx', t);
  end loop;

  -- Personal data: owner only.
  foreach t in array array[
    'habits', 'habit_logs', 'ai_messages', 'coach_messages', 'daily_metrics',
    'weekly_summaries', 'bookings'
  ] loop
    execute format('create policy "owner all" on public.%I for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid())', t);
  end loop;

  -- Catalogs: everyone signed in can read, admins write.
  foreach t in array array['experts', 'specialists', 'training_programs', 'library_contents'] loop
    execute format('create policy "read signed in" on public.%I for select to authenticated using (true)', t);
    execute format('create policy "admin write" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end;
$$;

-- user_profiles: owner, plus admins (the AdminUsers page manages plans).
create policy "profiles: owner all" on public.user_profiles
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "profiles: admin all" on public.user_profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create index habit_logs_date_idx on public.habit_logs (owner_id, completed_date);
create index daily_metrics_date_idx on public.daily_metrics (owner_id, log_date);

-- ---------------------------------------------------------------------------
-- Account deletion (Apple 5.1.1(v), Google Play): deletes the auth user;
-- every personal row goes with it through ON DELETE CASCADE.
-- ---------------------------------------------------------------------------
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

create or replace function public.admin_delete_user(target uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'admin only';
  end if;
  delete from auth.users where id = target;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
revoke all on function public.admin_delete_user(uuid) from public, anon;
grant execute on function public.delete_my_account() to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public bucket for profile photos, each user writes only in
-- their own folder (<user id>/file).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars: upload own folder" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: update own folder" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: delete own folder" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
