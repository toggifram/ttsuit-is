"use client";

import { useState } from "react";

import { processSteps } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ProcessSteps() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <ol className="mt-8 grid md:grid-cols-5 md:gap-6">
      {processSteps.map((step) => {
        const isOpen = open === step.n;
        return (
          <li
            key={step.n}
            className="border-b border-forest/10 last:border-b-0 md:border-b-0"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : step.n)}
              className="flex w-full items-center justify-between gap-4 py-4 text-left md:hidden"
            >
              <span className="flex min-w-0 items-baseline gap-3">
                <span className="font-serif text-xl text-forest/35">
                  {step.n}
                </span>
                <span className="font-serif text-2xl text-forest">
                  {step.title}
                </span>
              </span>
              <span
                aria-hidden
                className="shrink-0 font-serif text-2xl leading-none text-forest"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <p
              className={cn(
                "pb-4 text-[15px] leading-relaxed text-ink/70 md:hidden",
                isOpen ? "block" : "hidden"
              )}
            >
              {step.text}
            </p>

            <div className="hidden md:block">
              <p className="font-serif text-xl text-forest/35">{step.n}</p>
              <h3 className="mt-1.5 font-serif text-xl text-forest">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-snug text-ink/70">
                {step.text}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
