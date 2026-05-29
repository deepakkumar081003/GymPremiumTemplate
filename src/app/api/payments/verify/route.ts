import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fulfillSuccessfulPayment } from "@/lib/payments/fulfill-payment";

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
    const paymentId = body.paymentId as string | undefined;
    const razorpayOrderId = body.razorpay_order_id as string | undefined;
    const razorpayPaymentId = body.razorpay_payment_id as string | undefined;
    const razorpaySignature = body.razorpay_signature as string | undefined;

    if (!paymentId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: payment } = await admin
      .from("payments")
      .select("user_id")
      .eq("id", paymentId)
      .maybeSingle();

    if (!payment || payment.user_id !== user.id) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const result = await fulfillSuccessfulPayment(
      paymentId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );

    return NextResponse.json({
      success: true,
      membershipId: result.membershipId,
      invoiceId: result.invoiceId,
      planName: result.planName,
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment verification failed" },
      { status: 400 },
    );
  }
}
