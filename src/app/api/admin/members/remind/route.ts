import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";
import { formatDate } from "@/lib/membership-utils";

export async function POST(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const userId = body.userId as string | undefined;
  const endDate = body.endDate as string | undefined;
  const planName = body.planName as string | undefined;

  if (!userId || !endDate) {
    return NextResponse.json({ error: "userId and endDate are required" }, { status: 400 });
  }

  const { admin } = auth;

  const { error } = await admin.from("notifications").insert({
    user_id: userId,
    title: "Membership Renewal Reminder",
    message: `Your ${planName ?? "membership"} expires on ${formatDate(endDate)}. Renew online from your member portal.`,
    type: "renewal_reminder",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
