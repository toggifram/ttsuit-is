"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brand } from "@/lib/site";

type Kind = "contact" | "booking";

export function InquiryForm({ kind }: { kind: Kind }) {
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const isBooking = kind === "booking";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="border border-forest/15 bg-cream px-6 py-10">
        <p className="font-serif text-2xl text-forest">Takk fyrir línuna.</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
          Þetta er prufusíða svo pósturinn fer ekki sjálfkrafa. Sendu okkur
          endilega á{" "}
          <a className="underline" href={`mailto:${brand.email}`}>
            {brand.email}
          </a>{" "}
          og við svörum innan 48 klukkustunda.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Nafn" htmlFor={`${kind}-name`}>
        <Input
          id={`${kind}-name`}
          name="name"
          required
          className="h-11 rounded-none"
        />
      </Field>
      <Field label="Netfang" htmlFor={`${kind}-email`}>
        <Input
          id={`${kind}-email`}
          name="email"
          type="email"
          required
          className="h-11 rounded-none"
        />
      </Field>
      <Field label="Sími" htmlFor={`${kind}-phone`}>
        <Input id={`${kind}-phone`} name="phone" className="h-11 rounded-none" />
      </Field>
      {isBooking && (
        <Field label="Æskilegur tími" htmlFor={`${kind}-when`}>
          <Input
            id={`${kind}-when`}
            name="when"
            placeholder="T.d. næsta vika, eftir vinnu, laugardag"
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
          className="min-h-28 rounded-none"
          placeholder={
            isBooking
              ? "Jakkaföt, jakki, skyrtur, brúðkaup…"
              : "Hvernig getum við aðstoðað?"
          }
        />
      </Field>
      <Button
        type="submit"
        className="h-12 rounded-none bg-forest px-8 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-forest-mid"
      >
        {isBooking ? "Senda bókun" : "Senda"}
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
