export const NEWSLETTER_OFFER = {
  code: "Open10",
  percent: 10,
  storageKey: "tjetje.newsletter-offer",
} as const;

/** Percent codes applied at checkout. Do not advertise these on the site. */
const PRIVATE_PERCENT_OFFERS = [{ code: "toggi20", percent: 20 }] as const;

export type PercentOffer = {
  code: string;
  percent: number;
};

/** One code per order — first token if several were pasted. */
export function normalizeDiscountCode(raw?: string | null) {
  return (
    (raw ?? "")
      .trim()
      .split(/[\s,;]+/)
      .find(Boolean) ?? ""
  );
}

/** Gift cards are one code, often written with spaces or dashes. */
export function normalizeGiftCardCode(raw?: string | null) {
  return (raw ?? "").trim().replace(/[\s-]+/g, "").toUpperCase();
}

export function isNewsletterOffer(code?: string | null) {
  return (
    normalizeDiscountCode(code).toLowerCase() ===
    NEWSLETTER_OFFER.code.toLowerCase()
  );
}

export function knownPercentOffer(code?: string | null): PercentOffer | null {
  const normalized = normalizeDiscountCode(code).toLowerCase();
  if (!normalized) return null;
  if (normalized === NEWSLETTER_OFFER.code.toLowerCase()) {
    return {
      code: NEWSLETTER_OFFER.code,
      percent: NEWSLETTER_OFFER.percent,
    };
  }
  const privateOffer = PRIVATE_PERCENT_OFFERS.find(
    (offer) => offer.code.toLowerCase() === normalized
  );
  return privateOffer ? { code: privateOffer.code, percent: privateOffer.percent } : null;
}

export function percentOffAmount(subtotal: number, percent: number) {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  return Math.round(subtotal * (percent / 100));
}

export function newsletterOfferAmount(subtotal: number) {
  return percentOffAmount(subtotal, NEWSLETTER_OFFER.percent);
}
