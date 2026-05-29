"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { formatINR } from "@/lib/membership-utils";
import type { MembershipPlan } from "@/lib/types/database";

export default function MemberRenewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      setPlans((data as MembershipPlan[]) ?? []);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="premium-card h-64 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Renew or Upgrade</p>
        <h1 className="mt-2 text-3xl font-bold">Choose a Plan</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Select a membership plan to purchase or renew. Online checkout with Razorpay is coming in
          the next phase — for now, review plans here or contact the gym.
        </p>
      </div>

      {plans.length === 0 ? (
        <div className="premium-card rounded-3xl p-8 text-center">
          <p className="text-slate-300">No plans available yet.</p>
          <Link href="/plans" className="mt-4 inline-block text-sm text-cyan-300 hover:underline">
            View public plans page
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="premium-card flex flex-col rounded-3xl p-6"
            >
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
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-slate-400"
                title="Razorpay checkout — Phase 5"
              >
                Pay Online — Coming Soon
              </button>
            </article>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-5 text-sm text-cyan-100">
        Need help renewing? Visit the{" "}
        <Link href="/contact" className="font-semibold underline">
          contact page
        </Link>{" "}
        or speak with the front desk for offline renewal.
      </div>
    </div>
  );
}
