import type { Membership } from "@/lib/types/database";

export function computeMembershipDates(
  durationDays: number,
  activeMembership: Pick<Membership, "end_date" | "status"> | null,
): { startDate: Date; endDate: Date; isRenewal: boolean } {
  const now = new Date();

  if (activeMembership && activeMembership.status !== "cancelled") {
    const currentEnd = new Date(activeMembership.end_date);
    if (currentEnd.getTime() > now.getTime()) {
      const endDate = new Date(currentEnd);
      endDate.setUTCDate(endDate.getUTCDate() + durationDays);
      return { startDate: now, endDate, isRenewal: true };
    }
  }

  const endDate = new Date(now);
  endDate.setUTCDate(endDate.getUTCDate() + durationDays);
  return { startDate: now, endDate, isRenewal: false };
}

export function toIso(date: Date): string {
  return date.toISOString();
}
