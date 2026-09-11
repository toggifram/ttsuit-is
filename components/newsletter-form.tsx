"use client";

import { useState } from "react";

import { NewsletterOffer } from "@/components/newsletter-offer";
import { CONSENT_KEYS, writeConsent } from "@/lib/consent";
import { NEWSLETTER_OFFER } from "@/lib/offers";
import { subscribeNewsletter } from "@/lib/subscribe-newsletter";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "loading") return;
    setError("");
    setStatus("loading");
    try {
      await subscribeNewsletter(email);
      writeConsent(CONSENT_KEYS.newsletter, "subscribed");
      writeConsent(CONSENT_KEYS.newsletterOffer, NEWSLETTER_OFFER.code);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Gat ekki skráð netfangið. Reyndu aftur."
      );
    }
  }

  if (status === "done") {
    return (
      <div className="max-w-[16rem]">
        <NewsletterOffer variant={variant} />
      </div>
    );
  }

  const dark = variant === "dark";

  return (
    <div className="w-full max-w-[13.5rem]">
      <form
        onSubmit={onSubmit}
        className={cn(
          "flex w-full",
          dark ? "border border-white" : "border border-forest/25"
        )}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Netfang"
          aria-label="Netfang"
          disabled={status === "loading"}
          className={cn(
            "h-10 min-w-0 flex-1 bg-transparent px-3 text-[13px] outline-none",
            dark
              ? "text-white placeholder:text-white/45"
              : "text-ink placeholder:text-ink/40"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "shrink-0 border-l px-3 text-[10px] font-semibold tracking-[0.14em] uppercase",
            dark
              ? "border-white text-white hover:bg-white hover:text-forest"
              : "border-forest/25 text-forest hover:bg-forest hover:text-white"
          )}
        >
          {status === "loading" ? "…" : "Skrá"}
        </button>
      </form>
      {error ? (
        <p
          role="alert"
          className={cn(
            "mt-2 text-[12px] leading-snug",
            dark ? "text-white/70" : "text-red-700"
          )}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
