# Supabase Setup Guide — Phase 2 Authentication

Follow these steps to connect THULI GYM to Supabase.

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a project named `thuli-gym` (or similar)
3. Save your database password

## Step 2: Get API Credentials

Project Settings → API:

| Variable | Where to copy |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret key |

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

## Step 4: Run Database Migration

Open **Supabase → SQL Editor** and run both scripts in order:

1. `supabase/migrations/001_auth_setup.sql`
2. `supabase/migrations/002_fix_rls_recursion.sql` — resets policies safely
3. `supabase/migrations/003_remove_recursive_owner_policy.sql` — **required if you ran an older 002** that added `"Owners can read all users"`

This creates:

- `public.users` profile table
- Auto-profile trigger on signup (email + Google OAuth)
- Row Level Security policies
- Backfill for existing auth users

### Promote gym owner

After your first signup, run (replace email):

```sql
update public.users set role = 'owner' where email = 'your-email@gmail.com';
```

> All public signups default to `member`. Owner access is assigned manually for security.

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

## Step 6: Configure Redirect URLs

Authentication → URL Configuration:

**Site URL:** `http://localhost:3000` (dev) or your Vercel URL (prod)

**Redirect URLs:**

```
http://localhost:3000/auth/callback
https://your-app.vercel.app/auth/callback
```

## Step 7: Test Locally

```bash
npm run dev
```

Test flows:

| Flow | URL |
|---|---|
| Sign up | `/auth/signup` |
| Login | `/auth/login` |
| Forgot password | `/auth/forgot-password` |
| Dashboard | `/dashboard` |
| Logout | Dashboard → Logout button |

## Step 8: Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add the same env vars (use production URL for `NEXT_PUBLIC_APP_URL`)
4. Add production callback URL in Supabase redirect list
5. Deploy and test auth in production

## Troubleshooting

| Issue | Fix |
|---|---|
| Auth pages crash | Ensure `.env.local` exists (not `env.local`) |
| Signup works but no profile | Run `001_auth_setup.sql` migration |
| Google login fails | Check redirect URI in Google Console matches Supabase callback |
| Role always "member" | Promote owner via SQL (Step 4) |
| `infinite recursion detected in policy for relation "users"` | Run `003_remove_recursive_owner_policy.sql` in SQL Editor, then hard refresh |
| Password reset redirects wrong | Add `/auth/reset-password` in Supabase redirect URLs |

## What's Next

After auth works locally **and** on Vercel → Phase 3 (Member Dashboard + Razorpay).
