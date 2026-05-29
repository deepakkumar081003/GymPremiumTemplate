import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import {
  buildAnalyticsBuckets,
  findBucketForDate,
  getAnalyticsPeriodRange,
  isDateInRange,
  parseAnalyticsPeriod,
} from "@/lib/admin/analytics-period";
import { getActiveMembership } from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

export async function GET(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const periodId = parseAnalyticsPeriod(searchParams.get("period"));
  const range = getAnalyticsPeriodRange(periodId);
  const buckets = buildAnalyticsBuckets(range);

  const signupCounts = new Map(buckets.map((b) => [b.key, 0]));
  const revenueAmounts = new Map(buckets.map((b) => [b.key, 0]));

  const [membersRes, paymentsRes, membershipsRes] = await Promise.all([
    auth.admin.from("users").select("created_at").eq("role", "member"),
    auth.admin
      .from("payments")
      .select("amount, paid_at, status")
      .eq("status", "success")
      .gte("paid_at", range.start.toISOString())
      .lte("paid_at", range.end.toISOString()),
    auth.admin.from("memberships").select("created_at, end_date, status, user_id"),
  ]);

  let newMembers = 0;
  for (const m of membersRes.data ?? []) {
    const created = new Date(m.created_at);
    if (!isDateInRange(created, range)) continue;
    newMembers += 1;
    const bucket = findBucketForDate(buckets, created);
    if (bucket) signupCounts.set(bucket.key, (signupCounts.get(bucket.key) ?? 0) + 1);
  }

  let revenue = 0;
  let paymentCount = 0;
  for (const p of paymentsRes.data ?? []) {
    if (!p.paid_at) continue;
    const paid = new Date(p.paid_at);
    if (!isDateInRange(paid, range)) continue;
    const amount = Number(p.amount);
    revenue += amount;
    paymentCount += 1;
    const bucket = findBucketForDate(buckets, paid);
    if (bucket) revenueAmounts.set(bucket.key, (revenueAmounts.get(bucket.key) ?? 0) + amount);
  }

  let newMemberships = 0;
  const membershipByUser = new Map<string, Membership[]>();
  for (const row of membershipsRes.data ?? []) {
    const created = new Date(row.created_at);
    if (isDateInRange(created, range)) newMemberships += 1;
    if (!row.user_id) continue;
    const list = membershipByUser.get(row.user_id) ?? [];
    list.push(row as Membership);
    membershipByUser.set(row.user_id, list);
  }

  let activeMemberships = 0;
  for (const list of membershipByUser.values()) {
    if (getActiveMembership(list)) activeMemberships += 1;
  }

  const signupSeries = buckets.map((b) => ({
    label: b.label,
    count: signupCounts.get(b.key) ?? 0,
  }));

  const revenueSeries = buckets.map((b) => ({
    label: b.label,
    amount: revenueAmounts.get(b.key) ?? 0,
  }));

  return NextResponse.json({
    period: {
      id: range.id,
      label: range.label,
      start: range.start.toISOString(),
      end: range.end.toISOString(),
    },
    summary: {
      totalMembers: membersRes.data?.length ?? 0,
      activeMemberships,
      newMembers,
      newMemberships,
      revenue,
      paymentCount,
    },
    signupSeries,
    revenueSeries,
  });
}
