"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan");

  return (
    <div className="mx-auto max-w-lg space-y-8 text-center">
      <div className="premium-card rounded-3xl p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/20 text-3xl text-emerald-300">
          ✓
        </div>
        <h1 className="mt-6 text-3xl font-bold">Payment Successful</h1>
        <p className="mt-3 text-slate-400">
          {planName
            ? `Your ${planName} membership is now active.`
            : "Your membership has been activated."}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Invoice and payment details are available in your member portal.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/member/membership"
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            View Membership
          </Link>
          <Link
            href="/member/invoices"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            View Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="premium-card h-48 animate-pulse rounded-3xl" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
