"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnalyticsBarChart, AnalyticsComparisonChart, AnalyticsLineChart } from "@/components/admin/analytics-charts";
import { PeriodSelect } from "@/components/admin/period-select";
import {
  ANALYTICS_TIMEZONE_LABEL,
  formatRangeSubtitle,
  type AnalyticsPeriodId,
} from "@/lib/admin/analytics-period";
import { formatINR } from "@/lib/membership-utils";

type AnalyticsResponse = {
  period: {
    id: AnalyticsPeriodId;
    label: string;
    start: string;
    end: string;
  };
  summary: {
    totalMembers: number;
    activeMemberships: number;
    newMembers: number;
    newMemberships: number;
    revenue: number;
    paymentCount: number;
  };
  signupSeries: Array<{ label: string; count: number }>;
  revenueSeries: Array<{ label: string; amount: number }>;
};

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<AnalyticsPeriodId>("last_6_months");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async (selectedPeriod: AnalyticsPeriodId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?period=${encodeURIComponent(selectedPeriod)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to load analytics");
        setData(null);
      } else {
        setData(json as AnalyticsResponse);
      }
    } catch {
      setError("Failed to load analytics");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics(period);
  }, [period, loadAnalytics]);

  const signupChartData = useMemo(
    () => data?.signupSeries.map((r) => ({ label: r.label, value: r.count })) ?? [],
    [data],
  );

  const revenueChartData = useMemo(
    () => data?.revenueSeries.map((r) => ({ label: r.label, value: r.amount })) ?? [],
    [data],
  );

  const signupsEmpty = signupChartData.every((r) => r.value === 0);
  const revenueEmpty = revenueChartData.every((r) => r.value === 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Insights</p>
          <h1 className="mt-2 text-3xl font-bold">Analytics</h1>
          {data && (
            <p className="mt-2 text-sm text-slate-400">
              {data.period.label} · {formatRangeSubtitle(new Date(data.period.start), new Date(data.period.end))}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            All dates and chart buckets use {ANALYTICS_TIMEZONE_LABEL}.
          </p>
        </div>

        <PeriodSelect value={period} onChange={setPeriod} disabled={loading} />
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <AnalyticsSkeleton />
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Revenue"
              value={formatINR(data.summary.revenue)}
              hint={`${data.summary.paymentCount} successful payment${data.summary.paymentCount === 1 ? "" : "s"}`}
              accent="emerald"
            />
            <StatCard
              label="New members"
              value={String(data.summary.newMembers)}
              hint="Signups in this period"
              accent="cyan"
            />
            <StatCard
              label="New memberships"
              value={String(data.summary.newMemberships)}
              hint="Plans started in period"
              accent="violet"
            />
            <StatCard
              label="Active memberships"
              value={String(data.summary.activeMemberships)}
              hint="Currently active (live)"
              accent="amber"
            />
            <StatCard
              label="Total members"
              value={String(data.summary.totalMembers)}
              hint="All registered members"
              accent="slate"
            />
            <StatCard
              label="Avg. per payment"
              value={
                data.summary.paymentCount > 0
                  ? formatINR(Math.round(data.summary.revenue / data.summary.paymentCount))
                  : formatINR(0)
              }
              hint="Revenue ÷ payments in period"
              accent="emerald"
            />
          </div>

          <AnalyticsLineChart
            title="Revenue trend"
            subtitle={`Income over ${data.period.label.toLowerCase()}`}
            data={revenueChartData}
            formatValue={(v) => formatINR(v)}
            color="emerald"
            emptyMessage={revenueEmpty ? "No payments recorded in this period." : undefined}
          />

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <AnalyticsBarChart
                title="Member signups"
                subtitle={`New registrations · ${data.period.label.toLowerCase()}`}
                data={signupChartData}
                color="cyan"
                emptyMessage={signupsEmpty ? "No signups in this period." : undefined}
              />
            </div>
            <AnalyticsComparisonChart
              signups={signupChartData}
              revenue={revenueChartData}
              formatRevenue={formatINR}
            />
          </div>

          <DataTable
            title="Detailed breakdown"
            subtitle={`Scroll for full timeline · ${ANALYTICS_TIMEZONE_LABEL}`}
            signups={data.signupSeries}
            revenue={data.revenueSeries}
          />
        </>
      ) : null}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "cyan" | "emerald" | "amber" | "violet" | "slate";
}) {
  const border: Record<typeof accent, string> = {
    cyan: "border-cyan-400/30",
    emerald: "border-emerald-400/30",
    amber: "border-amber-400/30",
    violet: "border-violet-400/30",
    slate: "border-white/15",
  };

  const glow: Record<typeof accent, string> = {
    cyan: "from-cyan-400/10",
    emerald: "from-emerald-400/10",
    amber: "from-amber-400/10",
    violet: "from-violet-400/10",
    slate: "from-white/5",
  };

  return (
    <article
      className={`premium-card relative overflow-hidden rounded-2xl border p-5 ${border[accent]}`}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow[accent]} to-transparent`} />
      <p className="relative text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="relative mt-2 text-2xl font-bold md:text-3xl">{value}</p>
      <p className="relative mt-2 text-xs text-slate-500">{hint}</p>
    </article>
  );
}

function DataTable({
  title,
  subtitle,
  signups,
  revenue,
}: {
  title: string;
  subtitle: string;
  signups: Array<{ label: string; count: number }>;
  revenue: Array<{ label: string; amount: number }>;
}) {
  const rows = signups.map((s, i) => ({
    label: s.label,
    signups: s.count,
    revenue: revenue[i]?.amount ?? 0,
  }));

  if (rows.length === 0) return null;

  return (
    <section className="premium-card overflow-hidden rounded-3xl border border-white/10">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="premium-scrollbar max-h-80 overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 z-10 bg-slate-950/95 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-medium">Period</th>
              <th className="px-6 py-3 font-medium">Signups</th>
              <th className="px-6 py-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-6 py-3 text-slate-300">{row.label}</td>
                <td className="px-6 py-3 font-medium tabular-nums text-cyan-200">{row.signups}</td>
                <td className="px-6 py-3 font-medium tabular-nums text-emerald-200">
                  {formatINR(row.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="premium-card h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
      <div className="premium-card h-72 animate-pulse rounded-3xl" />
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="premium-card h-72 animate-pulse rounded-3xl xl:col-span-2" />
        <div className="premium-card h-72 animate-pulse rounded-3xl" />
      </div>
    </div>
  );
}
