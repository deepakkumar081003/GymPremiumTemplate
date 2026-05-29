import { normalizePhoneDigits } from "@/lib/validation/phone";

/** E.164-style digits for wa.me (no +), defaulting India country code for 10-digit numbers. */
export function normalizeWhatsAppPhone(phone: string): string | null {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return null;
  if (digits.length === 10) return `91${digits}`;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

export function buildWhatsAppUrl(phone: string, text: string): string | null {
  const normalized = normalizeWhatsAppPhone(phone);
  if (!normalized) return null;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
}
