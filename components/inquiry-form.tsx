"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitInquiry } from "@/lib/send-inquiry";

type Kind = "contact" | "booking";

export function InquiryForm({ kind }: { kind: Kind }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const isBooking = kind === "booking";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setError("");
    setStatus("loading");
    try {
      await submitInquiry({
        kind,
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        phone: String(data.get("phone") ?? ""),
        when: String(data.get("when") ?? ""),
        message: String(data.get("message") ?? ""),
        company: String(data.get("company") ?? ""),
      });
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message
          : "Gat ekki sent skilaboðin. Reyndu aftur."
      );
    }
  }

  if (status === "done") {
    return (
      <div className="border border-forest/15 bg-cream px-6 py-10">
        <p className="font-serif text-2xl text-forest">Takk fyrir línuna.</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
          {isBooking
            ? "Bókunin er komin til okkar á ttsuit@ttsuit.is. Við höfum samband innan 48 klukkustunda og finnum tíma sem hentar."
            : "Skilaboðin eru komin á ttsuit@ttsuit.is. Við svörum innan 48 klukkustunda."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />
      <Field label="Nafn" htmlFor={`${kind}-name`}>
        <Input
          id={`${kind}-name`}
          name="name"
          required
          disabled={status === "loading"}
          className="h-11 rounded-none"
        />
      </Field>
      <Field label="Netfang" htmlFor={`${kind}-email`}>
        <Input
          id={`${kind}-email`}
          name="email"
          type="email"
          required
          disabled={status === "loading"}
          className="h-11 rounded-none"
        />
      </Field>
      <Field label="Sími" htmlFor={`${kind}-phone`}>
        <Input
          id={`${kind}-phone`}
          name="phone"
          disabled={status === "loading"}
          className="h-11 rounded-none"
        />
      </Field>
      {isBooking && (
        <Field label="Æskilegur tími" htmlFor={`${kind}-when`}>
          <Input
            id={`${kind}-when`}
            name="when"
            placeholder="T.d. næsta vika, eftir vinnu, laugardag"
            disabled={status === "loading"}
            className="h-11 rounded-none"
          />
        </Field>
      )}
      <Field
        label={isBooking ? "Hvað viltu láta sauma?" : "Skilaboð"}
        htmlFor={`${kind}-message`}
      >
        <Textarea
          id={`${kind}-message`}
          name="message"
          required
          rows={5}
          disabled={status === "loading"}
          className="min-h-28 rounded-none"
          placeholder={
            isBooking
              ? "Jakkaföt, jakki, skyrtur, brúðkaup…"
              : "Hvernig getum við aðstoðað?"
          }
        />
      </Field>
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-none bg-forest px-8 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-forest-mid"
      >
        {status === "loading"
          ? "Sendi…"
          : isBooking
            ? "Senda bókun"
            : "Senda"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-xs tracking-[0.14em] uppercase">
        {label}
      </Label>
      {children}
    </div>
  );
}
