import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { amountToPaise, getRazorpayClient } from "@/lib/razorpay";
import { getActiveMembership } from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const planId = body.planId as string | undefined;

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: plan, error: planError } = await admin
      .from("membership_plans")
      .select("*")
      .eq("id", planId)
      .eq("is_active", true)
      .maybeSingle();

    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const { data: profile } = await admin
      .from("users")
      .select("name, email, phone")
      .eq("id", user.id)
      .maybeSingle();

    const { data: gymSettings } = await admin
      .from("gym_settings")
      .select("gym_name")
      .eq("gym_id", plan.gym_id)
      .maybeSingle();

    const { data: memberships } = await admin
      .from("memberships")
      .select("*")
      .eq("user_id", user.id);

    const activeMembership = getActiveMembership((memberships as Membership[]) ?? []);
    const paymentType = activeMembership ? "renewal" : "purchase";
    const amountPaise = amountToPaise(Number(plan.price));

    const razorpay = getRazorpayClient();
    const receipt = `gym_${user.id.slice(0, 8)}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt,
      notes: {
        user_id: user.id,
        plan_id: plan.id,
        payment_type: paymentType,
      },
    });

    const { data: payment, error: paymentError } = await admin
      .from("payments")
      .insert({
        user_id: user.id,
        plan_id: plan.id,
        amount: plan.price,
        currency: "INR",
        payment_type: paymentType,
        status: "pending",
        razorpay_order_id: order.id,
      })
      .select("id")
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
    }

    return NextResponse.json({
      paymentId: payment.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name,
      gymName: gymSettings?.gym_name ?? "THULI GYM",
      prefill: {
        name: profile?.name ?? user.email?.split("@")[0] ?? "Member",
        email: profile?.email ?? user.email,
        contact: profile?.phone ?? "",
      },
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 },
    );
  }
}
