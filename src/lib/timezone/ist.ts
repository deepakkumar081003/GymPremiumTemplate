/** India Standard Time — used for gym analytics, reporting, and admin date inputs. */
export const GYM_TIMEZONE = "Asia/Kolkata";

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

export type IstYmd = {
  year: number;
  month: number;
  day: number;
};

/** Wall-clock date/time in IST → UTC `Date` instant. */
export function istToDate(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
  ms = 0,
): Date {
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms) - IST_OFFSET_MS);
}

export function getIstYmd(date: Date): IstYmd {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: GYM_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const [year, month, day] = formatted.split("-").map(Number);
  return { year, month, day };
}

export function getIstHour(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: GYM_TIMEZONE,
      hour: "2-digit",
      hour12: false,
    }).format(date),
  );
}

export function startOfIstDay(date: Date): Date {
  const { year, month, day } = getIstYmd(date);
  return istToDate(year, month, day, 0, 0, 0, 0);
}

export function endOfIstDay(date: Date): Date {
  const { year, month, day } = getIstYmd(date);
  return istToDate(year, month, day, 23, 59, 59, 999);
}

export function addIstDays(ymd: IstYmd, days: number): IstYmd {
  const anchor = istToDate(ymd.year, ymd.month, ymd.day, 12, 0, 0, 0);
  const shifted = new Date(anchor.getTime() + days * 86_400_000);
  return getIstYmd(shifted);
}

export function toIstDateKey(date: Date): string {
  const { year, month, day } = getIstYmd(date);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatIstShortDate(date: Date): string {
  const nowYmd = getIstYmd(new Date());
  const { year, month, day } = getIstYmd(date);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: GYM_TIMEZONE,
    day: "numeric",
    month: "short",
    year: year !== nowYmd.year ? "numeric" : undefined,
  }).format(date);
}

export function formatIstMonthYear(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: GYM_TIMEZONE,
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatIstDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: GYM_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
