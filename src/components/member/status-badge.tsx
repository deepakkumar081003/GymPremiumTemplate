import { statusColorClass, statusLabel, type ResolvedMembershipStatus } from "@/lib/membership-utils";

export function StatusBadge({ status }: { status: ResolvedMembershipStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusColorClass(status)}`}
    >
      {statusLabel(status)}
    </span>
  );
}
