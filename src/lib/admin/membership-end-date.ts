import { toIso } from "@/lib/payments/membership-dates";
import { getIstYmd, istToDate } from "@/lib/timezone/ist";

/** Parse YYYY-MM-DD from admin date input as end of that IST day. */
export function parseAdminEndDateInput(dateStr: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return istToDate(year, month, day, 23, 59, 59, 999);
}

export function toDateInputValue(isoDate: string): string {
  const { year, month, day } = getIstYmd(new Date(isoDate));
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function resolveStatusForEndDate(endDate: Date): "active" | "expired" {
  return endDate.getTime() > Date.now() ? "active" : "expired";
}

export function endDateToIso(endDate: Date): string {
  return toIso(endDate);
}
