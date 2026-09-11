import { NEWSLETTER_OFFER } from "@/lib/offers";

export const CONSENT_KEYS = {
  newsletter: "tjetje.newsletter-popup",
  newsletterOffer: NEWSLETTER_OFFER.storageKey,
  cookies: "tjetje.cookie-consent",
} as const;

export type CookieChoice = "all" | "necessary";

export function readConsent(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeConsent(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}
