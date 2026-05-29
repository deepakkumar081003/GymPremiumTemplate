import {
  addIstDays,
  formatIstMonthYear,
  formatIstShortDate,
  getIstHour,
  getIstYmd,
  istToDate,
  startOfIstDay,
  toIstDateKey,
} from "@/lib/timezone/ist";

export type AnalyticsPeriodId =
  | "today"
  | "last_1_month"
  | "last_3_months"
  | "last_6_months"
  | "last_1_year"
  | "last_year";

export const ANALYTICS_PERIODS: Array<{ id: AnalyticsPeriodId; label: string }> = [
  { id: "today", label: "Today" },
  { id: "last_1_month", label: "Last 1 month" },
  { id: "last_3_months", label: "Last 3 months" },
  { id: "last_6_months", label: "Last 6 months" },
  { id: "last_1_year", label: "Last 1 year" },
  { id: "last_year", label: "Last year (calendar)" },
];

export const ANALYTICS_TIMEZONE_LABEL = "IST (India)";

export function parseAnalyticsPeriod(value: string | null): AnalyticsPeriodId {
  const valid = ANALYTICS_PERIODS.some((p) => p.id === value);
  return valid ? (value as AnalyticsPeriodId) : "last_6_months";
}

export type AnalyticsDateRange = {
  id: AnalyticsPeriodId;
  label: string;
  start: Date;
  end: Date;
};

export function getAnalyticsPeriodRange(periodId: AnalyticsPeriodId): AnalyticsDateRange {
  const label = ANALYTICS_PERIODS.find((p) => p.id === periodId)?.label ?? periodId;
  const now = new Date();
  const today = getIstYmd(now);

  if (periodId === "today") {
    return {
      id: periodId,
      label,
      start: startOfIstDay(now),
      end: now,
    };
  }

  if (periodId === "last_year") {
    const year = today.year - 1;
    return {
      id: periodId,
      label,
      start: istToDate(year, 1, 1, 0, 0, 0, 0),
      end: istToDate(year, 12, 31, 23, 59, 59, 999),
    };
  }

  const dayOffsets: Record<string, number> = {
    last_1_month: -30,
    last_3_months: -90,
    last_6_months: -180,
    last_1_year: -365,
  };

  const offset = dayOffsets[periodId] ?? -180;
  const startYmd = addIstDays(today, offset);

  return {
    id: periodId,
    label,
    start: istToDate(startYmd.year, startYmd.month, startYmd.day, 0, 0, 0, 0),
    end: now,
  };
}

type BucketGranularity = "hour" | "day" | "week" | "month";

function getGranularity(periodId: AnalyticsPeriodId): BucketGranularity {
  switch (periodId) {
    case "today":
      return "hour";
    case "last_1_month":
      return "day";
    case "last_3_months":
      return "week";
    default:
      return "month";
  }
}

export type AnalyticsBucket = {
  key: string;
  label: string;
  start: Date;
  end: Date;
};

export function buildAnalyticsBuckets(range: AnalyticsDateRange): AnalyticsBucket[] {
  const granularity = getGranularity(range.id);

  if (granularity === "hour") {
    const { year, month, day } = getIstYmd(range.start);
    const buckets: AnalyticsBucket[] = [];
    const currentHour = getIstHour(range.end);

    for (let h = 0; h < 24; h++) {
      const start = istToDate(year, month, day, h, 0, 0, 0);
      const end = istToDate(year, month, day, h, 59, 59, 999);
      if (start > range.end) continue;

      buckets.push({
        key: `h-${h}`,
        label: `${String(h).padStart(2, "0")}:00`,
        start,
        end: h > currentHour ? start : end,
      });
    }
    return buckets;
  }

  if (granularity === "day") {
    const buckets: AnalyticsBucket[] = [];
    let cursor = getIstYmd(range.start);
    const endYmd = getIstYmd(range.end);

    while (
      cursor.year < endYmd.year ||
      (cursor.year === endYmd.year && cursor.month < endYmd.month) ||
      (cursor.year === endYmd.year && cursor.month === endYmd.month && cursor.day <= endYmd.day)
    ) {
      const start = istToDate(cursor.year, cursor.month, cursor.day, 0, 0, 0, 0);
      const end = istToDate(cursor.year, cursor.month, cursor.day, 23, 59, 59, 999);
      buckets.push({
        key: toIstDateKey(start),
        label: formatIstShortDate(start),
        start,
        end: end > range.end ? range.end : end,
      });
      cursor = addIstDays(cursor, 1);
    }
    return buckets;
  }

  if (granularity === "week") {
    const buckets: AnalyticsBucket[] = [];
    let cursor = getIstYmd(range.start);
    const endYmd = getIstYmd(range.end);
    let index = 0;

    while (
      cursor.year < endYmd.year ||
      (cursor.year === endYmd.year && cursor.month < endYmd.month) ||
      (cursor.year === endYmd.year && cursor.month === endYmd.month && cursor.day <= endYmd.day)
    ) {
      const start = istToDate(cursor.year, cursor.month, cursor.day, 0, 0, 0, 0);
      const weekEndYmd = addIstDays(cursor, 6);
      let end = istToDate(weekEndYmd.year, weekEndYmd.month, weekEndYmd.day, 23, 59, 59, 999);
      if (end > range.end) end = range.end;

      buckets.push({
        key: `w-${index}`,
        label: formatIstShortDate(start),
        start,
        end,
      });

      cursor = addIstDays(cursor, 7);
      index += 1;
    }
    return buckets;
  }

  const buckets: AnalyticsBucket[] = [];
  const startYmd = getIstYmd(range.start);
  const endYmd = getIstYmd(range.end);
  let year = startYmd.year;
  let month = startYmd.month;

  while (year < endYmd.year || (year === endYmd.year && month <= endYmd.month)) {
    const start = istToDate(year, month, 1, 0, 0, 0, 0);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    let end = istToDate(year, month, lastDay, 23, 59, 59, 999);
    if (end > range.end) end = range.end;

    buckets.push({
      key: `${year}-${String(month).padStart(2, "0")}`,
      label: formatIstMonthYear(start),
      start,
      end,
    });

    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return buckets;
}

export function isDateInRange(date: Date, range: AnalyticsDateRange): boolean {
  return date >= range.start && date <= range.end;
}

export function findBucketForDate(buckets: AnalyticsBucket[], date: Date): AnalyticsBucket | undefined {
  return buckets.find((b) => date >= b.start && date <= b.end);
}

export function formatRangeSubtitle(start: Date, end: Date): string {
  return `${formatIstShortDate(start)} – ${formatIstShortDate(end)}`;
}
