-- THULI GYM — Phase 2 auth schema
-- Run this in Supabase SQL Editor (safe to re-run)

-- 1. Users profile table (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null default 'member' check (role in ('member', 'owner')),
  gym_id uuid,
  name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.users enable row level security;

-- 2. Auto-create profile when someone signs up (email or Google OAuth)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, role, name, avatar_url)
  values (
    new.id,
    new.email,
    'member',
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- 4. RLS policies
drop policy if exists "Users can read their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Users can insert their own profile" on public.users;
drop policy if exists "Owners can read all users" on public.users;

create policy "Users can read their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Owner admin features (list all members) use server-side service role in later phases.
-- Do NOT add a SELECT policy that queries public.users — it causes infinite RLS recursion.

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role then
    raise exception 'Role changes must be done by an administrator';
  end if;
  return new;
end;
$$;

drop trigger if exists users_prevent_role_change on public.users;

create trigger users_prevent_role_change
  before update on public.users
  for each row execute function public.prevent_role_change();

-- 5. Backfill profiles for existing auth users (if any)
insert into public.users (id, email, role, name)
select
  au.id,
  au.email,
  'member',
  coalesce(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  )
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null;

-- 6. Promote your gym owner account (replace with your email)
-- update public.users set role = 'owner' where email = 'your-email@gmail.com';
