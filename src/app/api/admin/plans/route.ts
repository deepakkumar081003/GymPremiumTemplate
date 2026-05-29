import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/admin/require-owner";

export async function GET() {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { data, error } = await auth.admin
    .from("membership_plans")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plans: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireOwner();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const gymId = body.gymId as string | undefined;

  let resolvedGymId = gymId;
  if (!resolvedGymId) {
    const { data: settings } = await auth.admin.from("gym_settings").select("gym_id").limit(1).maybeSingle();
    resolvedGymId = settings?.gym_id;
  }

  if (!resolvedGymId) {
    return NextResponse.json({ error: "Gym ID not found" }, { status: 400 });
  }

  const { data, error } = await auth.admin
    .from("membership_plans")
    .insert({
      gym_id: resolvedGymId,
      name: body.name,
      duration_days: body.durationDays,
      price: body.price,
      description: body.description ?? null,
      features: body.features ?? [],
      is_active: body.isActive ?? true,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ plan: data });
}
