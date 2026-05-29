import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import { getActiveMembership } from "@/lib/membership-utils";
import { buildRenewalReminderMessage } from "@/lib/renewal-reminder";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { gymConfig } from "@/config/gym-config";
import type { Membership } from "@/lib/types/database";

export async function GET(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const userId = new URL(request.url).searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { admin } = auth;

  const { data: member, error: memberError } = await admin
    .from("users")
    .select("id, name, phone")
    .eq("id", userId)
    .eq("role", "member")
    .maybeSingle();

  if (memberError || !member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  if (!member.phone) {
    return NextResponse.json(
      { error: "Member has no phone number on file. Add it in their profile first." },
      { status: 400 },
    );
  }

  const { data: membershipRows } = await admin
    .from("memberships")
    .select("*, plan:membership_plans(name)")
    .eq("user_id", userId);

  const activeMembership = getActiveMembership((membershipRows as Membership[]) ?? []);
  if (!activeMembership) {
    return NextResponse.json({ error: "No active membership to remind about" }, { status: 400 });
  }

  const message = buildRenewalReminderMessage({
    gymName: gymConfig.gymName,
    memberName: member.name,
    planName: activeMembership.plan?.name,
    endDate: activeMembership.end_date,
  });

  const whatsappUrl = buildWhatsAppUrl(member.phone, message);
  if (!whatsappUrl) {
    return NextResponse.json(
      { error: "Invalid member phone number. Use a valid 10-digit mobile number." },
      { status: 400 },
    );
  }

  return NextResponse.redirect(whatsappUrl);
}
