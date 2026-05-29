"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate, formatINR } from "@/lib/membership-utils";

type Stats = {
  totalMembers: number;
  activeMemberships: number;
  expiringSoon: number;
  monthlyRevenue: number;
  expiringMembers: Array<{
    id: string;
    end_date: string;
    user?: { name: string | null; email: string };
    plan?: { name: string };
  }>;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="premium-card h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-slate-400">Unable to load dashboard stats.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Admin</p>
        <h1 className="mt-2 text-3xl font-bold">Gym Overview</h1>
        <p className="mt-2 text-slate-400">Monitor members, revenue, and renewals at a glance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Members" value={String(stats.totalMembers)} />
        <StatCard label="Active Memberships" value={String(stats.activeMemberships)} />
        <StatCard label="Expiring in 7 Days" value={String(stats.expiringSoon)} />
        <StatCard label="Revenue This Month" value={formatINR(stats.monthlyRevenue)} />
      </div>

      <section className="premium-card rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Expiring Soon</h2>
          <Link href="/admin/members?filter=expiring" className="text-sm text-cyan-300 hover:underline">
            View all
          </Link>
        </div>
        {stats.expiringMembers.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">No memberships expiring in the next 7 days.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {stats.expiringMembers.map((m) => (
              <div
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div>
                  <p className="font-medium">{m.user?.name ?? m.user?.email ?? "Member"}</p>
                  <p className="text-sm text-slate-400">
                    {m.plan?.name ?? "Plan"} · expires {formatDate(m.end_date)}
                  </p>
                </div>
                <Link
                  href="/admin/members"
                  className="text-sm text-cyan-300 hover:underline"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <QuickLink href="/admin/members" title="Manage Members" description="Search, filter, offline onboarding" />
        <QuickLink href="/admin/payments" title="Payments & Invoices" description="Track all transactions" />
        <QuickLink href="/admin/announcements" title="Send Announcements" description="Notify all or expiring members" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="premium-card rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="premium-card block rounded-2xl p-5 transition hover:bg-white/10">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </Link>
  );
}
