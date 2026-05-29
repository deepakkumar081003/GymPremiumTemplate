import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";

export async function GET() {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  const [membersRes, paymentsRes, membershipsRes] = await Promise.all([
    auth.admin.from("users").select("created_at").eq("role", "member"),
    auth.admin
      .from("payments")
      .select("amount, paid_at, status")
      .eq("status", "success")
      .gte("paid_at", sixMonthsAgo.toISOString()),
    auth.admin.from("memberships").select("created_at, status"),
  ]);

  const membersByMonth: Record<string, number> = {};
  for (const m of membersRes.data ?? []) {
    const d = new Date(m.created_at);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    membersByMonth[key] = (membersByMonth[key] ?? 0) + 1;
  }

  const revenueByMonth: Record<string, number> = {};
  for (const p of paymentsRes.data ?? []) {
    if (!p.paid_at) continue;
    const d = new Date(p.paid_at);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    revenueByMonth[key] = (revenueByMonth[key] ?? 0) + Number(p.amount);
  }

  const monthLabels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    monthLabels.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`);
  }

  const monthlySignups = monthLabels.map((key) => ({ month: key, count: membersByMonth[key] ?? 0 }));
  const monthlyRevenue = monthLabels.map((key) => ({ month: key, amount: revenueByMonth[key] ?? 0 }));

  const thisMonthRevenue = (paymentsRes.data ?? [])
    .filter((p) => p.paid_at && new Date(p.paid_at) >= monthStart)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return NextResponse.json({
    totalMembers: membersRes.data?.length ?? 0,
    totalMemberships: membershipsRes.data?.length ?? 0,
    thisMonthRevenue,
    monthlySignups,
    monthlyRevenue,
  });
}
