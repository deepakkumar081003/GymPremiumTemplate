import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import {
  endDateToIso,
  parseAdminEndDateInput,
  resolveStatusForEndDate,
} from "@/lib/admin/membership-end-date";
import { formatDate } from "@/lib/membership-utils";
import { toIso } from "@/lib/payments/membership-dates";

export async function PATCH(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const membershipId = body.membershipId as string | undefined;
  const action = body.action as "update_expiry" | "cancel" | undefined;
  const endDateInput = body.endDate as string | undefined;

  if (!membershipId) {
    return NextResponse.json({ error: "Membership ID is required" }, { status: 400 });
  }

  if (action !== "update_expiry" && action !== "cancel") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { admin } = auth;

  const { data: membership, error: fetchError } = await admin
    .from("memberships")
    .select("id, user_id, plan_id, end_date, status, plan:membership_plans(name)")
    .eq("id", membershipId)
    .maybeSingle();

  if (fetchError || !membership) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 });
  }

  if (!membership.user_id) {
    return NextResponse.json({ error: "Membership has no linked member" }, { status: 400 });
  }

  const planName =
    (membership.plan as { name?: string } | null)?.name ?? "membership";

  if (action === "cancel") {
    const now = new Date();
    const { error: updateError } = await admin
      .from("memberships")
      .update({
        status: "cancelled",
        end_date: toIso(now),
      })
      .eq("id", membershipId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    await admin.from("notifications").insert({
      user_id: membership.user_id,
      title: "Membership Ended",
      message: `Your ${planName} plan was ended by the gym. Contact the front desk if you have questions.`,
      type: "membership_expired",
    });

    return NextResponse.json({
      success: true,
      status: "cancelled",
      endDate: toIso(now),
    });
  }

  if (!endDateInput) {
    return NextResponse.json({ error: "End date is required" }, { status: 400 });
  }

  const parsedEnd = parseAdminEndDateInput(endDateInput);
  if (!parsedEnd) {
    return NextResponse.json({ error: "Invalid end date (use YYYY-MM-DD)" }, { status: 400 });
  }

  const status = resolveStatusForEndDate(parsedEnd);
  const endIso = endDateToIso(parsedEnd);

  const { error: updateError } = await admin
    .from("memberships")
    .update({
      end_date: endIso,
      status,
    })
    .eq("id", membershipId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  await admin.from("notifications").insert({
    user_id: membership.user_id,
    title: "Membership Updated",
    message: `Your ${planName} plan expiry is now ${formatDate(endIso)}. Contact the gym if this looks incorrect.`,
    type: "announcement",
  });

  return NextResponse.json({
    success: true,
    status,
    endDate: endIso,
  });
}
