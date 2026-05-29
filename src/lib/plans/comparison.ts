import type { MembershipPlan } from "@/lib/types/database";
import { getHighlightedPlanIndex } from "@/lib/plans/plan-display";

export type ComparisonRow = {
  label: string;
  values: string[];
};

export function getEffectiveMonthlyPrice(price: number, durationDays: number): number {
  if (durationDays <= 0) return price;
  return Math.round((Number(price) / durationDays) * 30);
}

export function buildComparisonFeatures(plans: MembershipPlan[]): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  const byRichness = [...plans].sort(
    (a, b) => (b.features?.length ?? 0) - (a.features?.length ?? 0),
  );

  for (const plan of byRichness) {
    for (const feature of plan.features ?? []) {
      if (!seen.has(feature)) {
        seen.add(feature);
        ordered.push(feature);
      }
    }
  }

  return ordered;
}

export function planHasFeature(plan: MembershipPlan, feature: string): boolean {
  return (plan.features ?? []).includes(feature);
}

export function getPlanBadge(
  plan: MembershipPlan,
  plans: MembershipPlan[],
  highlightedPlanId: string,
): string | null {
  if (plan.id === highlightedPlanId) return "Most Popular";

  const name = plan.name.toLowerCase();
  if (name.includes("personal") || name.includes("elite") || name.includes("training")) {
    return "1:1 Coaching";
  }

  const sorted = [...plans].sort((a, b) => a.duration_days - b.duration_days);
  if (sorted.length > 1 && plan.id === sorted[0]?.id) return "Best To Start";
  if (sorted.length > 1 && plan.id === sorted[sorted.length - 1]?.id) return "Best Value";

  return null;
}

export function getHighlightedPlan(plans: MembershipPlan[]): MembershipPlan | null {
  if (plans.length === 0) return null;
  const index = getHighlightedPlanIndex(plans);
  return plans[index] ?? plans[0];
}

export function buildSummaryCards(plans: MembershipPlan[]): Array<{
  planId: string;
  title: string;
  subtitle: string;
  badge: string | null;
}> {
  const highlighted = getHighlightedPlan(plans);
  const highlightedId = highlighted?.id ?? "";

  return plans.map((plan) => {
    const badge = getPlanBadge(plan, plans, highlightedId);
    let subtitle = plan.description ?? "Flexible membership option";

    if (badge === "Best To Start") subtitle = "Ideal for first-time members testing the gym.";
    if (badge === "Most Popular") subtitle = "Best balance of price, commitment, and results.";
    if (badge === "Best Value") subtitle = "Maximum savings for long-term consistency.";
    if (badge === "1:1 Coaching") subtitle = "Dedicated coaching for accelerated transformation.";

    return {
      planId: plan.id,
      title: plan.name,
      subtitle,
      badge,
    };
  });
}
