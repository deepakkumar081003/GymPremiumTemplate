"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PURCHASE_LOGIN_MESSAGE, buildAuthUrl } from "@/lib/plans/purchase-flow";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";
  const loginHref = buildAuthUrl("/auth/login", {
    next: nextPath,
    message: PURCHASE_LOGIN_MESSAGE,
  });

  return (
    <div className="premium-card rounded-3xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-400/10 border border-cyan-400/50 mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold">Check Your Email</h1>
          <p className="mt-3 text-slate-300">
            We&apos;ve sent a verification link to your email address. Click the link to verify your
            account, then log in to buy your plan and join the gym.
          </p>

          <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/50 text-blue-200 text-sm">
            <p className="font-semibold mb-1">Didn&apos;t receive the email?</p>
            <p>Check your spam folder or try signing up again.</p>
          </div>

          <div className="mt-8">
            <Link
              href={loginHref}
              className="inline-block px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition"
            >
              Back to Login
            </Link>
          </div>
        </div>
  );
}
