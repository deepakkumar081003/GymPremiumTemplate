-- THULI GYM — Final RLS fix (run after 001 + 002)
-- The "Owners can read all users" policy causes infinite recursion on Supabase
-- even with is_owner(). Reading your own profile only needs auth.uid() = id.
-- Owner admin pages will use server-side service role in later phases.

drop policy if exists "Owners can read all users" on public.users;
drop policy if exists "Admins can read all users" on public.users;

-- Verify: you should have exactly 3 policies on public.users:
--   Users can read their own data
--   Users can update their own data
--   Users can insert their own profile
