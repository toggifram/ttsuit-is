"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

export function NewsletterForm({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "done">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("done");
  }

  if (status === "done") {
    return (
      <p
        className={cn(
          "text-sm",
          variant === "dark" ? "text-white/80" : "text-forest"
        )}
      >
        Takk — þú ert á listanum þegar póstlistinn fer í loftið.
      </p>
    );
  }

  const dark = variant === "dark";

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex w-full max-w-md",
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
        className={cn(
          "h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none",
          dark
            ? "text-white placeholder:text-white/45"
            : "text-ink placeholder:text-ink/40"
        )}
      />
      <button
        type="submit"
        className={cn(
          "shrink-0 border-l px-5 text-[11px] font-semibold tracking-[0.14em] uppercase",
          dark
            ? "border-white text-white hover:bg-white hover:text-forest"
            : "border-forest/25 text-forest hover:bg-forest hover:text-white"
        )}
      >
        Skrá
      </button>
    </form>
  );
}
