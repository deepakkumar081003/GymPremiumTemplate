import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import { getActiveMembership } from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

export async function GET() {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { admin } = auth;
  const now = new Date();
  const inSevenDays = new Date(now);
  inSevenDays.setUTCDate(inSevenDays.getUTCDate() + 7);

  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [
    membersRes,
    membershipsRes,
    paymentsRes,
    expiringRes,
  ] = await Promise.all([
    admin.from("users").select("id", { count: "exact", head: true }).eq("role", "member"),
    admin.from("memberships").select("*, plan:membership_plans(name)"),
    admin
      .from("payments")
      .select("amount, paid_at, status")
      .eq("status", "success")
      .gte("paid_at", monthStart.toISOString()),
    admin
      .from("memberships")
      .select("id, user_id, end_date, status, user:users(name, email), plan:membership_plans(name)")
      .eq("status", "active")
      .gte("end_date", now.toISOString())
      .lte("end_date", inSevenDays.toISOString())
      .order("end_date", { ascending: true }),
  ]);

  const memberships = (membershipsRes.data ?? []) as Membership[];
  const activeCount = memberships.filter((m) => {
    const active = getActiveMembership([m]);
    return active !== null;
  }).length;

  const monthlyRevenue = (paymentsRes.data ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  return NextResponse.json({
    totalMembers: membersRes.count ?? 0,
    activeMemberships: activeCount,
    expiringSoon: expiringRes.data?.length ?? 0,
    monthlyRevenue,
    expiringMembers: expiringRes.data ?? [],
  });
}
