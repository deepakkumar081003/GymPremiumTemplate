import { formatDate } from "@/lib/membership-utils";

export function buildRenewalReminderMessage(options: {
  gymName: string;
  memberName?: string | null;
  planName?: string | null;
  endDate: string;
}): string {
  const greeting = options.memberName?.trim() ? `Hi ${options.memberName.trim()},` : "Hi,";
  const plan = options.planName ?? "membership";
  return `${greeting} your ${plan} at ${options.gymName} expires on ${formatDate(options.endDate)}. Please renew online from your member portal. Thank you!`;
}
