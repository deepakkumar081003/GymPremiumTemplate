import Link from "next/link";
import { formatINR } from "@/lib/membership-utils";
import { formatDuration, getHighlightedPlanIndex } from "@/lib/plans/plan-display";
import { PlanBuyButton } from "@/components/plans/plan-buy-button";
import type { MembershipPlan } from "@/lib/types/database";

type PlansGridProps = {
  plans: MembershipPlan[];
  showCta?: boolean;
  showBuy?: boolean;
};

export function PlansGrid({ plans, showCta = false, showBuy = false }: PlansGridProps) {
  const highlightedIndex = getHighlightedPlanIndex(plans);

  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {plans.map((plan, index) => (
        <article
          key={plan.id}
          className={`rounded-3xl border p-6 ${
            index === highlightedIndex
              ? "glow-pulse border-cyan-300 bg-cyan-400/10"
              : "premium-card border-white/10 bg-white/5"
          }`}
        >
          <p className="text-sm text-slate-300">{formatDuration(plan.duration_days)}</p>
          <h2 className="mt-2 text-xl font-semibold">{plan.name}</h2>
          <p className="mt-2 text-3xl font-bold text-cyan-300">
            {formatINR(Number(plan.price))}
          </p>
          {plan.description && (
            <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
          )}
          {plan.features && plan.features.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          )}
          {showBuy && <PlanBuyButton planId={plan.id} label="Buy Now" />}
          {showCta && !showBuy && (
            <Link
              href="/plans"
              className="mt-6 inline-flex w-full justify-center rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              View Plans
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}
