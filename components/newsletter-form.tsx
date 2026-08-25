"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Netfang"
        aria-label="Netfang"
        className={cn(
          "h-11 rounded-none text-sm",
          variant === "dark"
            ? "border-white/25 bg-white/5 text-white placeholder:text-white/45 focus-visible:border-white/60 focus-visible:ring-white/20"
            : "border-forest/20 bg-white"
        )}
      />
      <Button
        type="submit"
        className={cn(
          "h-11 rounded-none px-5 text-[11px] tracking-[0.16em] uppercase",
          variant === "dark"
            ? "bg-white text-forest hover:bg-white/90"
            : "bg-forest text-white hover:bg-forest-mid"
        )}
      >
        Skrá
      </Button>
    </form>
  );
}
