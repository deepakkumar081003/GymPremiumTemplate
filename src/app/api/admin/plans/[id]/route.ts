import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await context.params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.durationDays !== undefined) updates.duration_days = body.durationDays;
  if (body.price !== undefined) updates.price = body.price;
  if (body.description !== undefined) updates.description = body.description;
  if (body.features !== undefined) updates.features = body.features;
  if (body.isActive !== undefined) updates.is_active = body.isActive;

  const { data, error } = await auth.admin
    .from("membership_plans")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: data });
}
