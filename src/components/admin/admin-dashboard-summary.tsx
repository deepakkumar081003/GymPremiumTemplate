"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/membership-utils";

type Stats = {
  totalMembers: number;
  activeMemberships: number;
  expiringSoon: number;
  monthlyRevenue: number;
};

export function AdminDashboardSummary() {
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
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="premium-card h-24 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Stat label="Members" value={String(stats.totalMembers)} />
        <Stat label="Active" value={String(stats.activeMemberships)} />
        <Stat label="Expiring Soon" value={String(stats.expiringSoon)} />
        <Stat label="Revenue (Month)" value={formatINR(stats.monthlyRevenue)} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminLink href="/admin" title="Admin Overview" description="Full gym dashboard" />
        <AdminLink href="/admin/members" title="Manage Members" description="Search, onboard, reminders" />
        <AdminLink href="/admin/memberships" title="Edit Plans" description="Pricing and plan details" />
        <AdminLink href="/admin/payments" title="Payments" description="Transactions and invoices" />
        <AdminLink href="/admin/announcements" title="Announcements" description="Notify members in-app" />
        <AdminLink href="/admin/analytics" title="Analytics" description="Growth and revenue charts" />
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="premium-card rounded-2xl p-4">
      <p className="text-xs uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function AdminLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="premium-card rounded-3xl p-6 transition hover:bg-white/10">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </Link>
  );
}
