export const MEMBER_STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "expired", label: "Expired" },
  { id: "none", label: "No plan" },
] as const;

export const MEMBER_EXPIRY_FILTERS = [
  { id: "expiring_7", label: "≤ 1 week", maxDays: 7 },
  { id: "expiring_30", label: "≤ 1 month", maxDays: 30 },
  { id: "expiring_90", label: "≤ 3 months", maxDays: 90 },
  { id: "expiring_180", label: "≤ 6 months", maxDays: 180 },
] as const;

/** Legacy dashboard link uses `expiring` (= 7 days). */
export function getExpiryFilterMaxDays(filter: string): number | null {
  if (filter === "expiring") return 7;

  const match = MEMBER_EXPIRY_FILTERS.find((f) => f.id === filter);
  return match?.maxDays ?? null;
}

export function isExpiryFilter(filter: string): boolean {
  return getExpiryFilterMaxDays(filter) !== null;
}
