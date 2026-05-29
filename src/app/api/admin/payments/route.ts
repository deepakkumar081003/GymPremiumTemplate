import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";

export async function GET() {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const [paymentsRes, invoicesRes] = await Promise.all([
    auth.admin
      .from("payments")
      .select("*, user:users(name, email), plan:membership_plans(name)")
      .order("created_at", { ascending: false })
      .limit(100),
    auth.admin
      .from("invoices")
      .select("*, user:users(name, email)")
      .order("issued_at", { ascending: false })
      .limit(100),
  ]);

  if (paymentsRes.error) {
    return NextResponse.json({ error: paymentsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    payments: paymentsRes.data ?? [],
    invoices: invoicesRes.data ?? [],
  });
}
