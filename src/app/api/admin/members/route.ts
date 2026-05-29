import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import { getActiveMembership, getDaysRemaining } from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

export async function GET(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const filter = searchParams.get("filter") ?? "all";

  const { admin } = auth;

  const { data: members, error } = await admin
    .from("users")
    .select("id, email, name, phone, created_at")
    .eq("role", "member")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: memberships } = await admin
    .from("memberships")
    .select("*, plan:membership_plans(name, price)")
    .order("created_at", { ascending: false });

  const membershipByUser = new Map<string, Membership[]>();
  for (const m of (memberships ?? []) as Membership[]) {
    if (!m.user_id) continue;
    const list = membershipByUser.get(m.user_id) ?? [];
    list.push(m);
    membershipByUser.set(m.user_id, list);
  }

  let result = (members ?? []).map((member) => {
    const userMemberships = membershipByUser.get(member.id) ?? [];
    const active = getActiveMembership(userMemberships);
    const daysRemaining = active ? getDaysRemaining(active.end_date) : null;

    return {
      ...member,
      activeMembership: active,
      daysRemaining,
    };
  });

  if (search) {
    result = result.filter(
      (m) =>
        m.email.toLowerCase().includes(search) ||
        (m.name?.toLowerCase().includes(search) ?? false) ||
        (m.phone?.includes(search) ?? false),
    );
  }

  if (filter === "active") {
    result = result.filter((m) => m.activeMembership !== null);
  } else if (filter === "expired") {
    result = result.filter((m) => !m.activeMembership && (membershipByUser.get(m.id)?.length ?? 0) > 0);
  } else if (filter === "none") {
    result = result.filter((m) => (membershipByUser.get(m.id)?.length ?? 0) === 0);
  } else if (filter === "expiring") {
    result = result.filter((m) => m.daysRemaining !== null && m.daysRemaining <= 7 && m.daysRemaining > 0);
  }

  return NextResponse.json({ members: result });
}
