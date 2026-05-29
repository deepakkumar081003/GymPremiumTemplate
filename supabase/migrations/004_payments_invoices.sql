-- THULI GYM — Phase 6 (continued): payments, invoices, notifications, gym_settings, RLS
-- Safe to re-run. Skips tables that already exist.
-- Run AFTER 001, 002, 003 (and after membership_plans + memberships exist or are created below).

-- =============================================================================
-- 1. Membership tables (for NEW gym deployments only — skipped if already exist)
-- =============================================================================

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null,
  name text not null,
  duration_days integer not null,
  price numeric not null,
  description text,
  features text[],
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  plan_id uuid references public.membership_plans(id) on delete set null,
  start_date timestamptz not null default timezone('utc'::text, now()),
  end_date timestamptz not null,
  status text default 'active' check (status in ('active', 'expired', 'cancelled')),
  source text not null default 'online' check (source in ('online', 'offline')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Add columns if tables existed before this migration (safe no-op if present)
alter table public.membership_plans add column if not exists is_active boolean not null default true;
alter table public.memberships add column if not exists source text not null default 'online';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'memberships_source_check'
  ) then
    alter table public.memberships
      add constraint memberships_source_check
      check (source in ('online', 'offline'));
  end if;
end $$;

-- =============================================================================
-- 2. Gym settings (one row per gym deployment)
-- =============================================================================

create table if not exists public.gym_settings (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid unique not null,
  gym_name text not null default 'THULI GYM',
  tagline text,
  description text,
  contact_email text,
  phone text,
  whatsapp_number text,
  address text,
  business_hours text[],
  logo_url text,
  primary_color text default '#22d3ee',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- =============================================================================
-- 3. Payments (Razorpay)
-- =============================================================================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  plan_id uuid references public.membership_plans(id) on delete set null,
  membership_id uuid references public.memberships(id) on delete set null,
  amount numeric not null,
  currency text not null default 'INR',
  payment_type text not null default 'purchase' check (payment_type in ('purchase', 'renewal')),
  status text not null default 'pending' check (status in ('pending', 'success', 'failed', 'refunded')),
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  failure_reason text,
  paid_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_razorpay_order_id_idx on public.payments(razorpay_order_id);
create index if not exists payments_status_idx on public.payments(status);

-- =============================================================================
-- 4. Invoices
-- =============================================================================

create sequence if not exists public.invoice_number_seq start 1001;

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  invoice_number text unique not null default (
    'INV-' || to_char(timezone('utc'::text, now()), 'YYYY') || '-' || lpad(nextval('public.invoice_number_seq')::text, 4, '0')
  ),
  user_id uuid not null references public.users(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  membership_id uuid references public.memberships(id) on delete set null,
  plan_name text not null,
  amount numeric not null,
  currency text not null default 'INR',
  member_name text,
  member_email text,
  gym_name text not null default 'THULI GYM',
  gym_address text,
  issued_at timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists invoices_user_id_idx on public.invoices(user_id);

-- =============================================================================
-- 5. Notifications
-- =============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  message text not null,
  type text not null default 'announcement' check (
    type in ('announcement', 'renewal_reminder', 'payment_success', 'membership_expired')
  ),
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_unread_idx on public.notifications(user_id, read_at);

-- =============================================================================
-- 6. updated_at triggers
-- =============================================================================

drop trigger if exists membership_plans_set_updated_at on public.membership_plans;
create trigger membership_plans_set_updated_at
  before update on public.membership_plans
  for each row execute function public.set_updated_at();

drop trigger if exists memberships_set_updated_at on public.memberships;
create trigger memberships_set_updated_at
  before update on public.memberships
  for each row execute function public.set_updated_at();

drop trigger if exists gym_settings_set_updated_at on public.gym_settings;
create trigger gym_settings_set_updated_at
  before update on public.gym_settings
  for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 7. Row Level Security
-- =============================================================================

alter table public.membership_plans enable row level security;
alter table public.memberships enable row level security;
alter table public.gym_settings enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.notifications enable row level security;

-- membership_plans: public catalog (anon + authenticated can read active plans)
drop policy if exists "Anyone can read active membership plans" on public.membership_plans;
create policy "Anyone can read active membership plans"
  on public.membership_plans for select
  using (is_active = true);

-- memberships: members see only their own
drop policy if exists "Members can read own memberships" on public.memberships;
create policy "Members can read own memberships"
  on public.memberships for select
  using (auth.uid() = user_id);

-- gym_settings: public read (branding on site)
drop policy if exists "Anyone can read gym settings" on public.gym_settings;
create policy "Anyone can read gym settings"
  on public.gym_settings for select
  using (true);

-- payments: members see only their own
drop policy if exists "Members can read own payments" on public.payments;
create policy "Members can read own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- invoices: members see only their own
drop policy if exists "Members can read own invoices" on public.invoices;
create policy "Members can read own invoices"
  on public.invoices for select
  using (auth.uid() = user_id);

-- notifications: members see and mark their own as read
drop policy if exists "Members can read own notifications" on public.notifications;
create policy "Members can read own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

drop policy if exists "Members can mark own notifications read" on public.notifications;
create policy "Members can mark own notifications read"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Writes to memberships, payments, invoices: server-side service role only (no INSERT/UPDATE policies)

-- =============================================================================
-- 8. Seed gym_settings from existing membership_plans gym_id (if any)
-- =============================================================================

insert into public.gym_settings (gym_id, gym_name, tagline, description, contact_email, phone, whatsapp_number, address)
select distinct
  mp.gym_id,
  'THULI GYM',
  'Train Strong. Live Elite.',
  'Premium fitness environment built for serious results.',
  'hello@thuligym.com',
  '+91 99999 99999',
  '+919999999999',
  '24 Fit Avenue, Chennai, Tamil Nadu, India'
from public.membership_plans mp
where mp.gym_id is not null
on conflict (gym_id) do nothing;

-- If no plans exist yet, seed a default gym row for new deployments
insert into public.gym_settings (gym_id, gym_name, tagline, contact_email)
values (
  '00000000-0000-0000-0000-000000000001',
  'THULI GYM',
  'Train Strong. Live Elite.',
  'hello@thuligym.com'
)
on conflict (gym_id) do nothing;

-- =============================================================================
-- 9. Seed default plans (NEW deployments only — skipped if names already exist)
-- =============================================================================

insert into public.membership_plans (gym_id, name, duration_days, price, description, features)
select
  '00000000-0000-0000-0000-000000000001',
  v.name,
  v.duration_days,
  v.price,
  v.description,
  v.features
from (values
  (
    'Monthly'::text,
    30,
    2499::numeric,
    'Perfect for getting started with premium training facilities.'::text,
    array['Gym floor access', '1 fitness consultation', 'Locker access']::text[]
  ),
  (
    'Quarterly',
    90,
    6499,
    'Best value for consistency and measurable progress.',
    array['Everything in Monthly', 'Diet guidance', 'Priority support']
  ),
  (
    'Yearly',
    365,
    21999,
    'For long-term transformation with maximum savings.',
    array['Everything in Quarterly', '2 body assessments', 'Member-only events']
  ),
  (
    'Personal Training Elite',
    30,
    9999,
    'Dedicated 1:1 coaching for accelerated results.',
    array['Dedicated trainer', 'Custom workouts', 'Weekly review']
  )
) as v(name, duration_days, price, description, features)
where not exists (
  select 1 from public.membership_plans mp where mp.name = v.name
);
