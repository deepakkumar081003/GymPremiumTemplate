import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";

export async function GET() {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data, error } = await auth.admin
    .from("notifications")
    .select("*, user:users(name, email)")
    .in("type", ["announcement", "renewal_reminder"])
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ announcements: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const title = body.title as string | undefined;
  const message = body.message as string | undefined;
  const target = body.target as "all" | "expiring" | undefined;

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
  }

  let userIds: string[] = [];

  if (target === "expiring") {
    const now = new Date();
    const inSevenDays = new Date(now);
    inSevenDays.setUTCDate(inSevenDays.getUTCDate() + 7);

    const { data: expiring } = await auth.admin
      .from("memberships")
      .select("user_id")
      .eq("status", "active")
      .gte("end_date", now.toISOString())
      .lte("end_date", inSevenDays.toISOString());

    userIds = [...new Set((expiring ?? []).map((m) => m.user_id).filter(Boolean) as string[])];
  } else {
    const { data: members } = await auth.admin.from("users").select("id").eq("role", "member");
    userIds = (members ?? []).map((m) => m.id);
  }

  if (userIds.length === 0) {
    return NextResponse.json({ error: "No members matched this announcement target" }, { status: 400 });
  }

  const rows = userIds.map((userId) => ({
    user_id: userId,
    title: title.trim(),
    message: message.trim(),
    type: target === "expiring" ? "renewal_reminder" : "announcement",
  }));

  const { error } = await auth.admin.from("notifications").insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, sent: userIds.length });
}
