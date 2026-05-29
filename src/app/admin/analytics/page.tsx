"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/membership-utils";

type Analytics = {
  totalMembers: number;
  totalMemberships: number;
  thisMonthRevenue: number;
  monthlySignups: Array<{ month: string; count: number }>;
  monthlyRevenue: Array<{ month: string; amount: number }>;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="premium-card h-64 animate-pulse rounded-3xl" />;
  }

  if (!data) {
    return <p className="text-slate-400">Unable to load analytics.</p>;
  }

  const maxSignup = Math.max(...data.monthlySignups.map((m) => m.count), 1);
  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.amount), 1);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Insights</p>
        <h1 className="mt-2 text-3xl font-bold">Analytics</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="premium-card rounded-2xl p-5">
          <p className="text-xs uppercase text-slate-400">Total Members</p>
          <p className="mt-2 text-3xl font-bold">{data.totalMembers}</p>
        </div>
        <div className="premium-card rounded-2xl p-5">
          <p className="text-xs uppercase text-slate-400">Total Membership Records</p>
          <p className="mt-2 text-3xl font-bold">{data.totalMemberships}</p>
        </div>
        <div className="premium-card rounded-2xl p-5">
          <p className="text-xs uppercase text-slate-400">This Month Revenue</p>
          <p className="mt-2 text-3xl font-bold">{formatINR(data.thisMonthRevenue)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="premium-card rounded-3xl p-6">
          <h2 className="text-lg font-semibold">Member Signups (6 months)</h2>
          <div className="mt-6 space-y-3">
            {data.monthlySignups.map((row) => (
              <div key={row.month}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-400">{row.month}</span>
                  <span>{row.count}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{ width: `${(row.count / maxSignup) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card rounded-3xl p-6">
          <h2 className="text-lg font-semibold">Revenue (6 months)</h2>
          <div className="mt-6 space-y-3">
            {data.monthlyRevenue.map((row) => (
              <div key={row.month}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-400">{row.month}</span>
                  <span>{formatINR(row.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-emerald-400"
                    style={{ width: `${(row.amount / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
