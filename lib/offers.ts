export const NEWSLETTER_OFFER = {
  code: "Open15",
  percent: 15,
  storageKey: "tjetje.newsletter-offer",
} as const;

export function isNewsletterOffer(code?: string | null) {
  return (code ?? "").trim().toLowerCase() === NEWSLETTER_OFFER.code.toLowerCase();
}

export function newsletterOfferAmount(subtotal: number) {
  if (!Number.isFinite(subtotal) || subtotal <= 0) return 0;
  return Math.round(subtotal * (NEWSLETTER_OFFER.percent / 100));
}
