# THULI GYM — Premium Gym Management Template

White-label SaaS-style gym website and management system. Built to sell to local gyms with minimal per-client changes: update branding config, create a new Supabase project, connect Razorpay, deploy to Vercel.

**Sample gym name:** THULI GYM (replace via `src/config/gym-config.ts` for each client)

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| Database & Auth | Supabase |
| Payments | Razorpay |
| Deployment | Vercel |
| Version control | GitHub |

---

## Build phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Premium landing website (home, plans, about, gallery, contact) | ✅ Done |
| 2 | Authentication (signup, login, logout, reset password, email verify, Google OAuth, roles) | ✅ Done — tested on Vercel |
| 6 | Database schema — membership tables | ✅ Done |
| 6 | Database schema — payments, invoices, notifications | ✅ Done (migration `004`) |
| 3 | Member dashboard (status, expiry, plan details, profile) | ✅ Done |
| 5 | Razorpay (buy & renew online) | ⏳ Next |
| 4 | Admin dashboard (members, offline onboarding, reminders, invoices) | ⏳ Pending |
| 7 | Email automation (renewal reminders) | ⏳ Pending |
| 8 | White-label polish (DB settings + config) | ⏳ Partial (`gym-config.ts` ready) |
| 9 | Per-client deployment checklist | ⏳ Pending |

---

## White-label model (one deploy per gym)

Each gym client gets:

1. **Clone this repo** (or fork)
2. **New Supabase project** — separate database, separate member data
3. **Edit `src/config/gym-config.ts`** — name, logo, colors, plans, contact, trainers
4. **Run Supabase migrations** — see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
5. **Razorpay account** — client's own keys in Vercel env vars
6. **Deploy to Vercel** — new project per client

No multi-tenant complexity. Each gym owns its data.

---

## Database schema (current)

Full column-level documentation: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

### Tables after migration `004`

| Table | Purpose |
|-------|---------|
| `users` | Profiles linked to Supabase Auth |
| `membership_plans` | Plan catalog (name, price, duration_days, features) |
| `memberships` | Member subscriptions (start/end dates, status, source) |
| `gym_settings` | Branding and contact stored in DB |
| `payments` | Razorpay transactions |
| `invoices` | Payment receipts |
| `notifications` | Renewal reminders and announcements |

### Migrations in repo

```
supabase/migrations/
  001_auth_setup.sql                   ✅ Run
  002_fix_rls_recursion.sql            ✅ Run
  003_remove_recursive_owner_policy.sql ✅ Run
  004_payments_invoices.sql            ✅ Run
```

> Migration `004` uses `IF NOT EXISTS` — safe on gyms where `membership_plans` and `memberships` already exist.

### Member portal routes (Phase 3)

| Route | Purpose |
|-------|---------|
| `/member/membership` | Active plan, expiry, history, payments |
| `/member/renew` | Plan selection (Razorpay in Phase 5) |
| `/member/invoices` | Invoice history + print |
| `/member/notifications` | Reminders and announcements |
| `/member/profile` | Update name and phone |

---

## Quick start (local dev)

```bash
npm install
cp .env.local.example .env.local
# Fill in Supabase keys — see SUPABASE_SETUP.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Phase 5 — Razorpay (add when integrating payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Project structure

```
src/
  app/              # Pages (landing, auth, dashboard, member, admin)
  components/       # Reusable UI (header, footer, protected routes)
  config/
    gym-config.ts   # ← White-label: edit this per gym client
    site-content.ts # Landing page content blocks
  lib/
    supabase/       # Client, server, middleware, admin helpers
    auth-context.tsx
supabase/
  migrations/       # SQL migrations — run in Supabase SQL Editor
SUPABASE_SETUP.md   # ← Database setup & schema reference (keep updated)
```

---

## Customizing for a new gym client

1. Copy `gym-config.ts` values (name, tagline, plans, contact, social links)
2. Create new Supabase project → run migrations per [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
3. Promote owner account via SQL
4. Seed `membership_plans` rows to match config prices
5. Set Vercel + Razorpay env vars
6. Deploy

---

## Documentation

| File | Contents |
|------|----------|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Auth setup, migrations, live schema, RLS, troubleshooting |
| README.md (this file) | Project overview, phases, white-label model |

**Rule:** Any Supabase or schema change must update `SUPABASE_SETUP.md`. Any phase or architecture change must update this README.

---

## What's next (development)

1. **Phase 5** — Razorpay checkout on `/member/renew` (buy + renew)
2. Build admin dashboard for member management and offline onboarding
3. Email automation for renewal reminders

---

## Deploy on Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables
4. Add Supabase redirect URLs for production domain
5. Deploy and test auth + payments

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) Step 8 for full checklist.
