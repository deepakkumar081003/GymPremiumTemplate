# Supabase Setup Guide — THULI GYM Template

Complete database and auth setup for each gym client. **One Supabase project per gym deployment.**

> **Keep this file updated.** Every new migration or schema change must be documented here so new gym clients can be replicated without confusion.

---

## Build progress (database)

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 2 — Auth (`users`, triggers, RLS) | ✅ Done | Migrations `001`–`003` |
| Phase 6 — Core membership tables | ✅ Done | `membership_plans`, `memberships` exist in Supabase |
| Phase 6 — Payments & invoices | ✅ Done | Migration `004` verified in Supabase |
| Phase 3 — Member dashboard wired to DB | ✅ Done | Membership, invoices, notifications, profile |
| Phase 5 — Razorpay | ✅ Done | Buy/renew on `/member/renew` |

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a project (e.g. `thuli-gym` or `client-gym-name`)
3. Save your database password

---

## Step 2: Get API Credentials

Project Settings → API:

| Variable | Where to copy |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret key |

---

## Step 3: Environment Variables

**Important:** Next.js only reads `.env.local` (with a leading dot).

```bash
cp .env.local.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For Vercel, add the same variables. Set `NEXT_PUBLIC_APP_URL` to your production URL.

---

## Step 4: Run Database Migrations (in order)

Open **Supabase → SQL Editor** and run each script in order:

| Order | File | Purpose |
|-------|------|---------|
| 1 | `supabase/migrations/001_auth_setup.sql` | `users` table, signup trigger, base RLS |
| 2 | `supabase/migrations/002_fix_rls_recursion.sql` | Safe RLS policies on `users` |
| 3 | `supabase/migrations/003_remove_recursive_owner_policy.sql` | Remove recursive owner policy |
| 4 | `membership_plans` + `memberships` | Already exist in THULI GYM — `004` skips creation via `IF NOT EXISTS` |
| 5 | `supabase/migrations/004_payments_invoices.sql` | ✅ Run — payments, invoices, notifications, gym_settings, RLS |

### After running `004`

Verify success:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

You should see: `gym_settings`, `invoices`, `membership_plans`, `memberships`, `notifications`, `payments`, `users`.

Check RLS policies (expect **10 policies** across 6 tables):

```sql
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename;
```

### Promote gym owner

After your first signup, run (replace email):

```sql
update public.users set role = 'owner' where email = 'your-email@gmail.com';
```

> All public signups default to `member`. Owner access is assigned manually for security.

---

## Current database schema (live — THULI GYM)

Last verified from Supabase `information_schema` export.

### Table: `public.users`

Extends `auth.users`. Created by migration `001`.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | FK → `auth.users(id)` |
| `email` | text | NO | |
| `role` | text | YES | `'member'` (`member` \| `owner`) |
| `gym_id` | uuid | YES | |
| `name` | text | YES | |
| `avatar_url` | text | YES | |
| `phone` | text | YES | |
| `created_at` | timestamptz | NO | `now()` UTC |
| `updated_at` | timestamptz | NO | `now()` UTC |

**RLS policies (active):**

| Policy | Operation |
|--------|-----------|
| Users can read their own data | SELECT |
| Users can update their own data | UPDATE |
| Users can insert their own profile | INSERT |

> Owner admin reads use **server-side service role** — never add a SELECT policy on `users` that queries `public.users` (causes infinite RLS recursion).

---

### Table: `public.membership_plans`

Catalog of plans a gym sells. **Already exists** in THULI GYM Supabase.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `gym_id` | uuid | NO | |
| `name` | text | NO | e.g. Monthly, Quarterly |
| `duration_days` | integer | NO | e.g. 30, 90, 365 |
| `price` | numeric | NO | INR amount (e.g. 2499) |
| `description` | text | YES | |
| `features` | text[] | YES | Array of feature strings |
| `is_active` | boolean | NO | `true` — added by `004` |
| `created_at` | timestamptz | NO | `now()` UTC |
| `updated_at` | timestamptz | NO | `now()` UTC |

**App mapping:** Prices in `src/config/gym-config.ts` should match rows here once seeded.

| Plan | duration_days | price (INR) |
|------|---------------|-------------|
| Monthly | 30 | 2499 |
| Quarterly | 90 | 6499 |
| Yearly | 365 | 21999 |
| Personal Training Elite | 30 | 9999 |

**RLS (after `004`):**

| Policy | Operation |
|--------|-----------|
| Anyone can read active membership plans | SELECT (`is_active = true`) |

---

### Table: `public.memberships`

A member's active or past subscription. **Already exists** in THULI GYM Supabase.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `user_id` | uuid | YES | FK → `public.users(id)` |
| `plan_id` | uuid | YES | FK → `public.membership_plans(id)` |
| `start_date` | timestamptz | NO | `now()` UTC |
| `end_date` | timestamptz | NO | Computed: start + plan duration |
| `status` | text | YES | `'active'` (`active` \| `expired` \| `cancelled`) |
| `source` | text | NO | `'online'` (`online` \| `offline`) — added by `004` |
| `created_at` | timestamptz | NO | `now()` UTC |
| `updated_at` | timestamptz | NO | `now()` UTC |

**Business rules (app logic):**

- **New purchase:** `start_date` = payment success time; `end_date` = start + `duration_days`
- **Renewal (active):** extend `end_date` from current expiry
- **Renewal (expired):** `start_date` = today; new `end_date` from today
- **Offline member:** admin creates row manually (Phase 4 admin dashboard)

**RLS (after `004`):**

| Policy | Operation |
|--------|-----------|
| Members can read own memberships | SELECT (`auth.uid() = user_id`) |

> Inserts/updates use **service role** (Razorpay webhook / admin API).

---

### Table: `public.gym_settings`

Created by migration `004`. One row per gym deployment.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `gym_id` | uuid | NO | unique |
| `gym_name` | text | NO | `'THULI GYM'` |
| `tagline` | text | YES | |
| `description` | text | YES | |
| `contact_email` | text | YES | |
| `phone` | text | YES | |
| `whatsapp_number` | text | YES | |
| `address` | text | YES | |
| `business_hours` | text[] | YES | |
| `logo_url` | text | YES | |
| `primary_color` | text | YES | `'#22d3ee'` |
| `created_at` | timestamptz | NO | `now()` UTC |
| `updated_at` | timestamptz | NO | `now()` UTC |

**RLS:** Anyone can read gym settings (public branding).

---

### Table: `public.payments`

Created by migration `004`. Razorpay transaction records.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `user_id` | uuid | NO | FK → `users(id)` |
| `plan_id` | uuid | YES | FK → `membership_plans(id)` |
| `membership_id` | uuid | YES | FK → `memberships(id)` |
| `amount` | numeric | NO | INR |
| `currency` | text | NO | `'INR'` |
| `payment_type` | text | NO | `'purchase'` (`purchase` \| `renewal`) |
| `status` | text | NO | `'pending'` (`pending` \| `success` \| `failed` \| `refunded`) |
| `razorpay_order_id` | text | YES | |
| `razorpay_payment_id` | text | YES | |
| `razorpay_signature` | text | YES | |
| `failure_reason` | text | YES | |
| `paid_at` | timestamptz | YES | |
| `created_at` | timestamptz | NO | `now()` UTC |
| `updated_at` | timestamptz | NO | `now()` UTC |

**RLS:** Members can read own payments. Writes via service role only.

---

### Table: `public.invoices`

Created by migration `004`. Generated after successful payment.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `invoice_number` | text | NO | auto `INV-YYYY-####` |
| `user_id` | uuid | NO | FK → `users(id)` |
| `payment_id` | uuid | YES | FK → `payments(id)` |
| `membership_id` | uuid | YES | FK → `memberships(id)` |
| `plan_name` | text | NO | snapshot at issue time |
| `amount` | numeric | NO | |
| `currency` | text | NO | `'INR'` |
| `member_name` | text | YES | |
| `member_email` | text | YES | |
| `gym_name` | text | NO | `'THULI GYM'` |
| `gym_address` | text | YES | |
| `issued_at` | timestamptz | NO | `now()` UTC |
| `created_at` | timestamptz | NO | `now()` UTC |

**RLS:** Members can read own invoices. Writes via service role only.

---

### Table: `public.notifications`

Created by migration `004`. In-app reminders and announcements.

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| `id` | uuid | NO | `gen_random_uuid()` |
| `user_id` | uuid | NO | FK → `users(id)` |
| `title` | text | NO | |
| `message` | text | NO | |
| `type` | text | NO | `announcement` \| `renewal_reminder` \| `payment_success` \| `membership_expired` |
| `read_at` | timestamptz | YES | null = unread |
| `created_at` | timestamptz | NO | `now()` UTC |

**RLS:** Members can read and mark own notifications read.

---

### Entity relationships

```
auth.users
    └── public.users (1:1)
            ├── public.memberships (1:many)
            │       └── public.membership_plans (many:1)
            ├── public.payments (1:many)
            ├── public.invoices (1:many)
            └── public.notifications (1:many)

public.gym_settings (1 per gym_id)
```

---

## Verify your schema

Run in SQL Editor to confirm tables match this doc:

```sql
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'users',
    'membership_plans',
    'memberships',
    'payments',
    'invoices',
    'notifications',
    'gym_settings'
  )
ORDER BY table_name, ordinal_position;
```

Check RLS policies:

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Before `004`:** 3 policies on `users` only.

**After `004`:** 10 policies across `users`, `membership_plans`, `memberships`, `gym_settings`, `payments`, `invoices`, `notifications`.

---

## Step 5: Enable Google OAuth (Optional)

### Supabase

Authentication → Providers → Google → Enable

### Google Cloud Console

1. Create OAuth 2.0 Web Client
2. Authorized redirect URI:

```
https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
```

3. Paste Client ID + Secret into Supabase Google provider

---

## Step 6: Configure Redirect URLs

Authentication → URL Configuration:

**Site URL:** `http://localhost:3000` (dev) or your Vercel URL (prod)

**Redirect URLs:**

```
http://localhost:3000/auth/callback
https://your-app.vercel.app/auth/callback
http://localhost:3000/auth/reset-password
https://your-app.vercel.app/auth/reset-password
```

---

## Step 7: Test Locally

```bash
npm run dev
```

| Flow | URL |
|------|-----|
| Sign up | `/auth/signup` |
| Login | `/auth/login` |
| Forgot password | `/auth/forgot-password` |
| Reset password | `/auth/reset-password` |
| Email verify | `/auth/verify-email` |
| Dashboard | `/dashboard` |
| Logout | Dashboard → Logout button |

---

## Step 8: Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add env vars (production URL for `NEXT_PUBLIC_APP_URL`)
4. Add production callback URLs in Supabase
5. Deploy and test auth in production

---

## Troubleshooting

| Issue | Fix |
|-------|-------|
| Auth pages crash | Ensure `.env.local` exists (not `env.local`) |
| Signup works but no profile | Run `001_auth_setup.sql` |
| Google login fails | Check redirect URI in Google Console |
| Role always "member" | Promote owner via SQL (Step 4) |
| `infinite recursion detected in policy for relation "users"` | Run `003_remove_recursive_owner_policy.sql` |
| Password reset redirects wrong | Add `/auth/reset-password` in Supabase redirect URLs |
| Plans page shows config but dashboard empty | Membership tables exist but app not wired yet (Phase 3) |

---

## Step 9: Razorpay (Phase 5)

Add to `.env.local` and **Vercel → Environment Variables**:

```bash
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

> Use **test keys** (`rzp_test_...`) until you go live. Never commit secrets to GitHub.

### Test payment flow

1. Login as a **member** (not owner)
2. Go to `/member/renew`
3. Click **Pay Online** on any plan
4. In Razorpay popup, use test card: `4111 1111 1111 1111`
5. Any future expiry, any CVV, complete OTP
6. Redirects to `/member/payment/success`
7. Check `/member/membership`, `/member/invoices` for updated data

### API routes

| Route | Purpose |
|-------|---------|
| `POST /api/payments/create-order` | Creates Razorpay order + pending payment row |
| `POST /api/payments/verify` | Verifies signature, activates membership, creates invoice |

---

## Step 10: Admin portal (Phase 4)

Login as **owner** (`role = 'owner'` in `public.users`).

| Route | Purpose |
|-------|---------|
| `/admin` | Overview — members, revenue, expiring soon |
| `/admin/members` | Member list, offline onboarding, renewal reminders |
| `/admin/memberships` | Edit plans and pricing |
| `/admin/payments` | Payments and invoices |
| `/admin/announcements` | Send in-app notifications |
| `/admin/analytics` | 6-month signup and revenue charts |

Admin API routes use **service role** server-side after verifying the logged-in user is `owner`.

### Offline onboarding

1. Go to `/admin/members` → **Offline Onboard**
2. Enter email, name, phone, select plan
3. If email exists → membership activated/extended
4. If new email → Supabase invite email sent + membership created

---

## What's next

1. **Phase 7** — email automation (expiry/renewal emails via Resend or similar)
2. Per-client deployment checklist

Update this file after each migration is created and run.
