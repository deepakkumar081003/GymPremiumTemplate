"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/member/status-badge";
import {
  formatDate,
  formatDateTime,
  formatINR,
  getActiveMembership,
  getDaysRemaining,
  resolveMembershipStatus,
} from "@/lib/membership-utils";
import type { Membership, Payment } from "@/lib/types/database";

export default function MemberMembershipPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      const supabase = createClient();

      const [membershipsRes, paymentsRes] = await Promise.all([
        supabase
          .from("memberships")
          .select("*, plan:membership_plans(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("payments")
          .select("*, plan:membership_plans(name, price)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (membershipsRes.error) {
        setError(membershipsRes.error.message);
      } else {
        setMemberships((membershipsRes.data as Membership[]) ?? []);
      }

      if (!paymentsRes.error) {
        setPayments((paymentsRes.data as Payment[]) ?? []);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const activeMembership = getActiveMembership(memberships);
  const activeStatus = activeMembership ? resolveMembershipStatus(activeMembership) : null;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-white/5" />
        <div className="premium-card h-48 animate-pulse rounded-3xl" />
        <div className="premium-card h-32 animate-pulse rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Membership</p>
        <h1 className="mt-2 text-3xl font-bold">My Membership</h1>
        <p className="mt-2 text-slate-400">Track your plan, expiry, and payment history.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {activeMembership && activeStatus ? (
        <section className="premium-card rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Current Plan</p>
              <h2 className="mt-1 text-2xl font-semibold">
                {activeMembership.plan?.name ?? "Membership Plan"}
              </h2>
            </div>
            <StatusBadge status={activeStatus} />
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Start Date" value={formatDate(activeMembership.start_date)} />
            <Stat label="Expiry Date" value={formatDate(activeMembership.end_date)} />
            <Stat
              label="Days Remaining"
              value={
                getDaysRemaining(activeMembership.end_date) > 0
                  ? `${getDaysRemaining(activeMembership.end_date)} days`
                  : "Expired"
              }
            />
            <Stat
              label="Renewal Amount"
              value={
                activeMembership.plan?.price != null
                  ? formatINR(Number(activeMembership.plan.price))
                  : "—"
              }
            />
          </div>

          {activeMembership.plan?.features && activeMembership.plan.features.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-medium text-slate-300">Plan includes</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {activeMembership.plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-slate-400">
                    • {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(activeStatus === "expiring_soon" || activeStatus === "expired") && (
            <div className="mt-8">
              <Link
                href="/member/renew"
                className="inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Renew Now
              </Link>
            </div>
          )}
        </section>
      ) : (
        <section className="premium-card rounded-3xl p-8 text-center">
          <p className="text-lg font-semibold">No active membership</p>
          <p className="mt-2 text-sm text-slate-400">
            Choose a plan to start training at THULI GYM.
          </p>
          <Link
            href="/member/renew"
            className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            View Plans
          </Link>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold">Membership History</h2>
        {memberships.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No membership records yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {memberships.map((membership) => {
              const status = resolveMembershipStatus(membership);
              return (
                <article key={membership.id} className="premium-card rounded-2xl p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{membership.plan?.name ?? "Plan"}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {formatDate(membership.start_date)} → {formatDate(membership.end_date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase text-slate-500">{membership.source}</span>
                      <StatusBadge status={status} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Payment History</h2>
        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No payments yet. Online payments appear here after checkout.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-t border-white/10">
                    <td className="px-4 py-3 text-slate-300">
                      {formatDateTime(payment.paid_at ?? payment.created_at)}
                    </td>
                    <td className="px-4 py-3">{payment.plan?.name ?? "—"}</td>
                    <td className="px-4 py-3 capitalize">{payment.payment_type}</td>
                    <td className="px-4 py-3">{formatINR(Number(payment.amount))}</td>
                    <td className="px-4 py-3 capitalize">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
