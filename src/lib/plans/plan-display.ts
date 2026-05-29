import type { MembershipPlan } from "@/lib/types/database";

export function formatDuration(days: number): string {
  if (days === 30) return "30 Days";
  if (days === 90) return "90 Days";
  if (days === 365) return "365 Days";
  return `${days} Days`;
}

export function getHighlightedPlanIndex(plans: MembershipPlan[]): number {
  const quarterlyIndex = plans.findIndex((p) =>
    p.name.toLowerCase().includes("quarterly"),
  );
  if (quarterlyIndex >= 0) return quarterlyIndex;
  return plans.length > 1 ? 1 : 0;
}
