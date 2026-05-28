-- THULI GYM — Fix infinite RLS recursion on public.users
-- Run this ENTIRE script in Supabase → SQL Editor (safe to re-run)

-- 1. Drop every existing policy on public.users (clears broken recursive policy)
drop policy if exists "Users can read their own data" on public.users;
drop policy if exists "Users can update their own data" on public.users;
drop policy if exists "Users can insert their own profile" on public.users;
drop policy if exists "Owners can read all users" on public.users;

-- 2. Recreate safe policies (no self-referential SELECT policy)
create policy "Users can read their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Owner admin features use server-side service role in later phases.

-- 3. Prevent clients from changing their own role (owner promotion stays SQL-only)
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
