import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import { computeMembershipDates, toIso } from "@/lib/payments/membership-dates";
import { getActiveMembership } from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

export async function POST(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const planId = body.planId as string | undefined;
  const userId = body.userId as string | undefined;
  const email = body.email as string | undefined;
  const name = body.name as string | undefined;
  const phone = body.phone as string | undefined;

  if (!planId) {
    return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
  }

  const { admin } = auth;

  const { data: plan, error: planError } = await admin
    .from("membership_plans")
    .select("*")
    .eq("id", planId)
    .maybeSingle();

  if (planError || !plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  let memberId = userId;

  if (!memberId && email) {
    const { data: existing } = await admin
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (existing) {
      memberId = existing.id;
    } else {
      const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(
        email.toLowerCase(),
        { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      );

      if (inviteError || !invited.user) {
        return NextResponse.json(
          { error: inviteError?.message ?? "Failed to invite member" },
          { status: 500 },
        );
      }

      memberId = invited.user.id;

      await admin
        .from("users")
        .update({
          name: name ?? null,
          phone: phone ?? null,
          role: "member",
        })
        .eq("id", memberId);
    }
  }

  if (!memberId) {
    return NextResponse.json({ error: "User ID or email is required" }, { status: 400 });
  }

  const { data: membershipRows } = await admin
    .from("memberships")
    .select("*")
    .eq("user_id", memberId);

  const activeMembership = getActiveMembership((membershipRows as Membership[]) ?? []);
  const { startDate, endDate, isRenewal } = computeMembershipDates(
    plan.duration_days,
    activeMembership,
  );

  let membershipId: string;

  if (isRenewal && activeMembership) {
    const { data: updated, error: updateError } = await admin
      .from("memberships")
      .update({
        plan_id: plan.id,
        end_date: toIso(endDate),
        status: "active",
        source: "offline",
      })
      .eq("id", activeMembership.id)
      .select("id")
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ error: "Failed to extend membership" }, { status: 500 });
    }
    membershipId = updated.id;
  } else {
    const { data: created, error: createError } = await admin
      .from("memberships")
      .insert({
        user_id: memberId,
        plan_id: plan.id,
        start_date: toIso(startDate),
        end_date: toIso(endDate),
        status: "active",
        source: "offline",
      })
      .select("id")
      .single();

    if (createError || !created) {
      return NextResponse.json({ error: "Failed to create membership" }, { status: 500 });
    }
    membershipId = created.id;
  }

  await admin.from("notifications").insert({
    user_id: memberId,
    title: isRenewal ? "Membership Renewed (Offline)" : "Membership Activated",
    message: `Your ${plan.name} plan is active until ${endDate.toLocaleDateString("en-IN")}.`,
    type: "announcement",
  });

  return NextResponse.json({
    success: true,
    membershipId,
    memberId,
    endDate: toIso(endDate),
  });
}
