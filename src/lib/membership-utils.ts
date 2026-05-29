import type { Membership } from "@/lib/types/database";

export type ResolvedMembershipStatus = "active" | "expired" | "cancelled" | "expiring_soon";

export function resolveMembershipStatus(membership: Membership): ResolvedMembershipStatus {
  if (membership.status === "cancelled") return "cancelled";

  const end = new Date(membership.end_date);
  const now = new Date();

  if (end.getTime() <= now.getTime()) return "expired";

  const daysRemaining = getDaysRemaining(membership.end_date);
  if (daysRemaining <= 7) return "expiring_soon";

  return "active";
}

export function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getActiveMembership(memberships: Membership[]): Membership | null {
  const sorted = [...memberships].sort(
    (a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
  );

  for (const membership of sorted) {
    const status = resolveMembershipStatus(membership);
    if (status === "active" || status === "expiring_soon") {
      return membership;
    }
  }

  return null;
}

export function statusLabel(status: ResolvedMembershipStatus): string {
  switch (status) {
    case "active":
      return "Active";
    case "expiring_soon":
      return "Expiring Soon";
    case "expired":
      return "Expired";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function statusColorClass(status: ResolvedMembershipStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-400/15 text-emerald-300 border-emerald-400/30";
    case "expiring_soon":
      return "bg-amber-400/15 text-amber-300 border-amber-400/30";
    case "expired":
      return "bg-red-400/15 text-red-300 border-red-400/30";
    case "cancelled":
      return "bg-slate-400/15 text-slate-300 border-slate-400/30";
    default:
      return "bg-slate-400/15 text-slate-300 border-slate-400/30";
  }
}
