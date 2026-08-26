"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CONSENT_KEYS, readConsent, writeConsent } from "@/lib/consent";
import { cn } from "@/lib/utils";

export function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const [error, setError] = useState("");
  const emailId = useId();
  const termsId = useId();

  useEffect(() => {
    if (readConsent(CONSENT_KEYS.newsletter)) return;
    const timer = window.setTimeout(() => setOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function dismiss() {
    writeConsent(CONSENT_KEYS.newsletter, "seen");
    setOpen(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    if (!agreed) {
      setError("Þú þarft að samþykkja skilmálana.");
      return;
    }
    setError("");
    setStatus("done");
    writeConsent(CONSENT_KEYS.newsletter, "subscribed");
  }

  useEffect(() => {
    if (status !== "done") return;
    const timer = window.setTimeout(() => setOpen(false), 2800);
    return () => window.clearTimeout(timer);
  }, [status]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <button
        type="button"
        aria-label="Loka"
        className="absolute inset-0 bg-black/45"
        onClick={dismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="newsletter-popup-title"
        className="relative z-10 grid w-full max-w-[860px] overflow-hidden bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
      >
        <div className="relative hidden min-h-[420px] bg-[#ebe6dc] md:block">
          <img
            src="/images/studio/yfirhafnir.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
        <div className="relative flex flex-col items-center px-8 py-12 text-center md:px-12 md:py-16">
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-4 right-4 text-ink/45 transition-colors hover:text-ink"
            aria-label="Loka glugga"
          >
            <X className="size-5" />
          </button>
          <Logo size="md" variant="dark" className="object-center" />
          {status === "done" ? (
            <p className="mt-10 max-w-[20rem] text-sm leading-relaxed text-ink/70">
              Takk. Við sendum þér 15% afsláttinn á netfangið þitt — hann gildir
              á gjafabréf og tilbúinn fatnað.
            </p>
          ) : (
            <>
              <h2
                id="newsletter-popup-title"
                className="mt-8 font-serif text-[1.85rem] leading-tight text-forest md:text-[2.15rem]"
              >
                Velkominn í heiminn okkar
              </h2>
              <p className="mt-3 max-w-[22rem] text-[13px] leading-relaxed text-ink/55">
                Skráðu þig á póstlistann og fáðu 15% afslátt af gjafabréfum og
                öllum tilbúnum fatnaði.
              </p>
              <form
                onSubmit={onSubmit}
                className="mt-8 flex w-full max-w-[22rem] flex-col text-left"
              >
                <Input
                  id={emailId}
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Netfangið þitt"
                  aria-label="Netfang"
                  className="h-12 rounded-none px-3 text-sm"
                />
                <Label
                  htmlFor={termsId}
                  className="mt-4 items-start gap-2.5 text-[12px] font-normal text-ink/65"
                >
                  <input
                    id={termsId}
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 size-3.5 shrink-0 accent-forest"
                  />
                  <span>
                    Ég samþykki{" "}
                    <Link
                      href="/skilmalar"
                      target="_blank"
                      className="underline underline-offset-2 hover:text-forest"
                    >
                      skilmála og persónuvernd
                    </Link>
                    .
                  </span>
                </Label>
                {error ? (
                  <p className="mt-2 text-[12px] text-red-700">{error}</p>
                ) : null}
                <Button
                  type="submit"
                  className={cn(
                    "mt-6 h-12 w-full rounded-none text-[11px] font-semibold tracking-[0.16em] uppercase"
                  )}
                >
                  Fáðu afsláttinn
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
