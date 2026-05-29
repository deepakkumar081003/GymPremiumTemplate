import type { ReactNode } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/membership-utils";
import { formatDuration, getHighlightedPlanIndex } from "@/lib/plans/plan-display";
import {
  buildComparisonFeatures,
  buildSummaryCards,
  getEffectiveMonthlyPrice,
  getPlanBadge,
  planHasFeature,
} from "@/lib/plans/comparison";
import type { MembershipPlan } from "@/lib/types/database";

type MembershipComparisonProps = {
  plans: MembershipPlan[];
  title?: string;
  subtitle?: string;
  showSummaryCards?: boolean;
  showFeatureMatrix?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
};

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/15 text-sm text-cyan-300">
        ✓
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-sm text-slate-600">
      —
    </span>
  );
}

export function MembershipComparison({
  plans,
  title = "Membership Comparison",
  subtitle = "Compare plans side by side and choose what fits your goals and schedule.",
  showSummaryCards = true,
  showFeatureMatrix = true,
  ctaHref,
  ctaLabel = "View Plans",
}: MembershipComparisonProps) {
  if (plans.length === 0) return null;

  const highlightedIndex = getHighlightedPlanIndex(plans);
  const highlightedPlan = plans[highlightedIndex];
  const highlightedId = highlightedPlan?.id ?? "";
  const features = buildComparisonFeatures(plans);
  const summaryCards = buildSummaryCards(plans);

  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Compare Plans</p>
        <h2 className="mt-3 text-3xl font-semibold">{title}</h2>
        {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
      </div>

      {showSummaryCards && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const isHighlighted = card.planId === highlightedId;
            return (
              <article
                key={card.planId}
                className={`rounded-3xl border p-5 transition ${
                  isHighlighted
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "premium-card border-white/10 bg-white/5"
                }`}
              >
                {card.badge && (
                  <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                    {card.badge}
                  </span>
                )}
                <h3 className={`font-semibold ${card.badge ? "mt-3" : ""} text-lg`}>{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.subtitle}</p>
              </article>
            );
          })}
        </div>
      )}

      {showFeatureMatrix && (
        <div className="premium-card overflow-hidden rounded-3xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="sticky left-0 z-10 min-w-[180px] bg-slate-900/95 px-5 py-4 font-medium text-slate-400">
                    What you get
                  </th>
                  {plans.map((plan, index) => {
                    const badge = getPlanBadge(plan, plans, highlightedId);
                    const isHighlighted = index === highlightedIndex;

                    return (
                      <th
                        key={plan.id}
                        className={`min-w-[160px] px-5 py-4 ${
                          isHighlighted ? "bg-cyan-400/10" : ""
                        }`}
                      >
                        <div className="space-y-1">
                          {badge && (
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                              {badge}
                            </p>
                          )}
                          <p className="text-base font-semibold text-white">{plan.name}</p>
                          <p className="text-lg font-bold text-cyan-300">
                            {formatINR(Number(plan.price))}
                          </p>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <ComparisonRow
                  label="Duration"
                  plans={plans}
                  highlightedIndex={highlightedIndex}
                  renderValue={(plan) => formatDuration(plan.duration_days)}
                />
                <ComparisonRow
                  label="Effective monthly"
                  plans={plans}
                  highlightedIndex={highlightedIndex}
                  renderValue={(plan) =>
                    formatINR(getEffectiveMonthlyPrice(Number(plan.price), plan.duration_days))
                  }
                />
                {features.map((feature) => (
                  <ComparisonRow
                    key={feature}
                    label={feature}
                    plans={plans}
                    highlightedIndex={highlightedIndex}
                    renderValue={(plan) => (
                      <CheckIcon included={planHasFeature(plan, feature)} />
                    )}
                    isFeature
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {ctaHref && (
        <div className="flex justify-center">
          <Link
            href={ctaHref}
            className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({
  label,
  plans,
  highlightedIndex,
  renderValue,
  isFeature = false,
}: {
  label: string;
  plans: MembershipPlan[];
  highlightedIndex: number;
  renderValue: (plan: MembershipPlan) => ReactNode;
  isFeature?: boolean;
}) {
  return (
    <tr className="border-b border-white/5 last:border-0">
      <td className="sticky left-0 z-10 bg-slate-950/95 px-5 py-4 font-medium text-slate-300">
        {label}
      </td>
      {plans.map((plan, index) => (
        <td
          key={plan.id}
          className={`px-5 py-4 ${index === highlightedIndex ? "bg-cyan-400/5" : ""} ${
            isFeature ? "text-center" : "text-slate-200"
          }`}
        >
          {renderValue(plan)}
        </td>
      ))}
    </tr>
  );
}
