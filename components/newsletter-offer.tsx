"use client";

import { useState } from "react";

import { NEWSLETTER_OFFER } from "@/lib/offers";
import { cn } from "@/lib/utils";

export function NewsletterOffer({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [copied, setCopied] = useState(false);
  const dark = variant === "dark";

  async function copy() {
    try {
      await navigator.clipboard.writeText(NEWSLETTER_OFFER.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={cn("space-y-3", dark ? "text-white/85" : "text-ink/70")}>
      <p className="text-sm leading-relaxed">
        Takk. Kóðinn þinn er <span className="font-semibold">{NEWSLETTER_OFFER.code}</span>{" "}
        — 15% af tilbúnum fatnaði í vefverslun. Gildir ekki á gjafabréf eða
        sérsaum.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={cn(
            "font-serif text-3xl tracking-[0.06em]",
            dark ? "text-white" : "text-forest"
          )}
        >
          {NEWSLETTER_OFFER.code}
        </p>
        <button
          type="button"
          onClick={() => void copy()}
          className={cn(
            "h-9 px-3 text-[11px] font-semibold tracking-[0.14em] uppercase",
            dark
              ? "border border-white/40 text-white hover:bg-white hover:text-forest"
              : "border border-forest/25 text-forest hover:bg-forest hover:text-white"
          )}
        >
          {copied ? "Afritað" : "Afrita"}
        </button>
      </div>
    </div>
  );
}
