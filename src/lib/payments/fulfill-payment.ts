import { createAdminClient } from "@/lib/supabase/admin";
import { computeMembershipDates, toIso } from "@/lib/payments/membership-dates";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getActiveMembership } from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

type FulfillResult = {
  membershipId: string;
  invoiceId: string;
  planName: string;
};

export async function fulfillSuccessfulPayment(
  paymentId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): Promise<FulfillResult> {
  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    throw new Error("Invalid payment signature");
  }

  const admin = createAdminClient();

  const { data: payment, error: paymentError } = await admin
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .maybeSingle();

  if (paymentError || !payment) {
    throw new Error("Payment record not found");
  }

  if (payment.razorpay_order_id !== razorpayOrderId) {
    throw new Error("Order mismatch");
  }

  if (payment.status === "success") {
    const { data: existingInvoice } = await admin
      .from("invoices")
      .select("id, plan_name")
      .eq("payment_id", paymentId)
      .maybeSingle();

    return {
      membershipId: payment.membership_id ?? "",
      invoiceId: existingInvoice?.id ?? "",
      planName: existingInvoice?.plan_name ?? "",
    };
  }

  const { data: plan, error: planError } = await admin
    .from("membership_plans")
    .select("*")
    .eq("id", payment.plan_id)
    .maybeSingle();

  if (planError || !plan) {
    throw new Error("Plan not found");
  }

  const { data: userProfile } = await admin
    .from("users")
    .select("name, email")
    .eq("id", payment.user_id)
    .maybeSingle();

  const { data: gymSettings } = await admin
    .from("gym_settings")
    .select("gym_name, address")
    .eq("gym_id", plan.gym_id)
    .maybeSingle();

  const { data: membershipRows } = await admin
    .from("memberships")
    .select("*")
    .eq("user_id", payment.user_id)
    .order("created_at", { ascending: false });

  const activeMembership = getActiveMembership((membershipRows as Membership[]) ?? []);
  const { startDate, endDate, isRenewal } = computeMembershipDates(
    plan.duration_days,
    activeMembership,
  );

  let membershipId = payment.membership_id;

  if (isRenewal && activeMembership) {
    const { data: updatedMembership, error: updateError } = await admin
      .from("memberships")
      .update({
        plan_id: plan.id,
        end_date: toIso(endDate),
        status: "active",
        source: "online",
      })
      .eq("id", activeMembership.id)
      .select("id")
      .single();

    if (updateError || !updatedMembership) {
      throw new Error("Failed to extend membership");
    }

    membershipId = updatedMembership.id;
  } else {
    const { data: newMembership, error: insertError } = await admin
      .from("memberships")
      .insert({
        user_id: payment.user_id,
        plan_id: plan.id,
        start_date: toIso(startDate),
        end_date: toIso(endDate),
        status: "active",
        source: "online",
      })
      .select("id")
      .single();

    if (insertError || !newMembership) {
      throw new Error("Failed to create membership");
    }

    membershipId = newMembership.id;
  }

  const paidAt = new Date().toISOString();

  const { error: paymentUpdateError } = await admin
    .from("payments")
    .update({
      status: "success",
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
      membership_id: membershipId,
      paid_at: paidAt,
      payment_type: isRenewal ? "renewal" : "purchase",
    })
    .eq("id", paymentId);

  if (paymentUpdateError) {
    throw new Error("Failed to update payment");
  }

  const { data: invoice, error: invoiceError } = await admin
    .from("invoices")
    .insert({
      user_id: payment.user_id,
      payment_id: paymentId,
      membership_id: membershipId,
      plan_name: plan.name,
      amount: payment.amount,
      currency: payment.currency,
      member_name: userProfile?.name,
      member_email: userProfile?.email,
      gym_name: gymSettings?.gym_name ?? "THULI GYM",
      gym_address: gymSettings?.address,
      issued_at: paidAt,
    })
    .select("id")
    .single();

  if (invoiceError || !invoice) {
    throw new Error("Failed to create invoice");
  }

  await admin.from("notifications").insert({
    user_id: payment.user_id,
    title: isRenewal ? "Membership Renewed" : "Membership Activated",
    message: `Your ${plan.name} plan is now active until ${endDate.toLocaleDateString("en-IN")}.`,
    type: "payment_success",
  });

  return {
    membershipId,
    invoiceId: invoice.id,
    planName: plan.name,
  };
}
