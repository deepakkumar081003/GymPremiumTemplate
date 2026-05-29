export const PHONE_VALIDATION_MESSAGE =
  "Enter a valid 10-digit mobile number (digits only, no country code).";

export function normalizePhoneDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

export function isValidIndianMobile(phone: string | null | undefined): boolean {
  const digits = normalizePhoneDigits(phone);
  return /^\d{10}$/.test(digits);
}

export function formatPhoneForStorage(phone: string): string {
  return normalizePhoneDigits(phone);
}
