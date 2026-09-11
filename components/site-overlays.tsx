"use client";

import { Analytics } from "@/components/analytics";
import { CookieBanner } from "@/components/cookie-banner";
import { NewsletterPopup } from "@/components/newsletter-popup";

export function SiteOverlays() {
  return (
    <>
      <Analytics />
      <NewsletterPopup />
      <CookieBanner />
    </>
  );
}
