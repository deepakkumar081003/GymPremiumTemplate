"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/membership-utils";
import { getProfileUrlForPurchase } from "@/lib/plans/purchase-flow";
import { loadRazorpayScript } from "@/lib/razorpay-checkout";
import { isValidIndianMobile } from "@/lib/validation/phone";
import type { MembershipPlan } from "@/lib/types/database";

export default function MemberRenewContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlanId = searchParams.get("planId");
  const autoCheckoutAttempted = useRef(false);

  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [memberPhone, setMemberPhone] = useState<string | null>(null);
  const [payingPlanId, setPayingPlanId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const supabase = createClient();
      const [{ data: planData }, { data: profile }] = await Promise.all([
        supabase
          .from("membership_plans")
          .select("*")
          .eq("is_active", true)
          .order("price", { ascending: true }),
        supabase.from("users").select("phone").eq("id", user.id).maybeSingle(),
      ]);

      setPlans((planData as MembershipPlan[]) ?? []);
      setMemberPhone(profile?.phone ?? null);
      setLoading(false);
    };

    load();
  }, [user]);

  const handlePay = useCallback(
    async (plan: MembershipPlan) => {
      setError(null);

      if (!isValidIndianMobile(memberPhone)) {
        setError("Add a valid 10-digit mobile number in your profile before purchasing.");
        router.push(getProfileUrlForPurchase(plan.id));
        return;
      }

      setPayingPlanId(plan.id);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        setError("Failed to load Razorpay checkout. Please refresh and try again.");
        setPayingPlanId(null);
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!publicKey) {
        setError("Razorpay is not configured. Add NEXT_PUBLIC_RAZORPAY_KEY_ID to environment variables.");
        setPayingPlanId(null);
        return;
      }

      try {
        const orderRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId: plan.id }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) {
          throw new Error(orderData.error ?? "Failed to create order");
        }

        const rzp = new window.Razorpay({
          key: publicKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: orderData.gymName,
          description: orderData.planName,
          order_id: orderData.orderId,
          prefill: orderData.prefill,
          theme: { color: "#22d3ee" },
          modal: {
            ondismiss: () => {
              setPayingPlanId(null);
            },
          },
          handler: async (response) => {
            try {
              const verifyRes = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  paymentId: orderData.paymentId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyRes.ok) {
                throw new Error(verifyData.error ?? "Payment verification failed");
              }

              router.push(
                `/member/payment/success?plan=${encodeURIComponent(verifyData.planName)}`,
              );
            } catch (verifyError) {
              setError(
                verifyError instanceof Error
                  ? verifyError.message
                  : "Payment verification failed",
              );
            } finally {
              setPayingPlanId(null);
            }
          },
        });

        rzp.on("payment.failed", (response) => {
          setError(response.error?.description ?? "Payment failed. Please try again.");
          setPayingPlanId(null);
        });

        rzp.open();
      } catch (payError) {
        setError(payError instanceof Error ? payError.message : "Unable to start checkout");
        setPayingPlanId(null);
      }
    },
    [memberPhone, router],
  );

  useEffect(() => {
    if (loading || !selectedPlanId || autoCheckoutAttempted.current) return;

    const selectedPlan = plans.find((p) => p.id === selectedPlanId);
    if (!selectedPlan) return;

    if (!isValidIndianMobile(memberPhone)) return;

    autoCheckoutAttempted.current = true;
    handlePay(selectedPlan);
  }, [loading, selectedPlanId, plans, memberPhone, handlePay]);

  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="premium-card h-64 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  const phoneMissing = !isValidIndianMobile(memberPhone);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Buy or Renew</p>
        <h1 className="mt-2 text-3xl font-bold">Choose a Plan</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Pay securely with Razorpay. A valid 10-digit mobile number is required before checkout.
        </p>
      </div>

      {phoneMissing && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <p className="font-semibold">Mobile number required</p>
          <p className="mt-2">
            Add your 10-digit mobile number in your profile before purchasing. No OTP verification
            is needed — we only store your number for membership records.
          </p>
          <Link
            href={
              selectedPlanId
                ? getProfileUrlForPurchase(selectedPlanId)
                : "/member/profile?next=/member/renew&message=Add+your+10-digit+mobile+number+before+purchasing+a+plan."
            }
            className="mt-3 inline-block font-semibold text-cyan-300 hover:underline"
          >
            Update profile →
          </Link>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <div className="premium-card rounded-3xl p-8 text-center">
          <p className="text-slate-300">No plans available yet.</p>
          <Link href="/plans" className="mt-4 inline-block text-sm text-cyan-300 hover:underline">
            View public plans page
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const isSelected = plan.id === selectedPlanId;
            return (
              <article
                key={plan.id}
                className={`premium-card flex flex-col rounded-3xl p-6 ${
                  isSelected ? "ring-2 ring-cyan-400/60" : ""
                }`}
              >
                {isSelected && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    Selected plan
                  </p>
                )}
                <p className="text-sm text-slate-400">{plan.duration_days} days</p>
                <h2 className="mt-2 text-xl font-semibold">{plan.name}</h2>
                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {formatINR(Number(plan.price))}
                </p>
                {plan.description && (
                  <p className="mt-3 text-sm text-slate-400">{plan.description}</p>
                )}
                {plan.features && plan.features.length > 0 && (
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                    {plan.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                )}
                <button
                  onClick={() => handlePay(plan)}
                  disabled={payingPlanId !== null || phoneMissing}
                  className="mt-6 w-full rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {payingPlanId === plan.id ? "Opening checkout..." : "Buy Now"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-5 text-sm text-cyan-100">
        <p className="font-semibold">Razorpay test mode</p>
        <p className="mt-2 text-cyan-200/90">
          Use test card <span className="font-mono">4111 1111 1111 1111</span>, any future expiry,
          any CVV, and complete the OTP step in the Razorpay popup.
        </p>
      </div>
    </div>
  );
}
