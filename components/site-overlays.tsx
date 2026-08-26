"use client";

import { CookieBanner } from "@/components/cookie-banner";
import { NewsletterPopup } from "@/components/newsletter-popup";

export function SiteOverlays() {
  return (
    <>
      <NewsletterPopup />
      <CookieBanner />
    </>
  );
}
