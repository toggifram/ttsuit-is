"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brand } from "@/lib/site";

type Kind = "contact" | "booking";

export function InquiryForm({ kind }: { kind: Kind }) {
  const [sent, setSent] = useState(false);
  const [nextUrl, setNextUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [when, setWhen] = useState("");
  const [message, setMessage] = useState("");
  const isBooking = kind === "booking";

  useEffect(() => {
    const here = new URL(window.location.href);
    if (here.searchParams.get("sent") === kind) {
      setSent(true);
    }
    here.searchParams.set("sent", kind);
    if (isBooking) here.hash = "boka-tima";
    else here.hash = "";
    setNextUrl(here.toString());
  }, [kind, isBooking]);

  if (sent) {
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

  const subject = `${isBooking ? "Bókun mælingar" : "Hafa samband"}${
    name.trim() ? ` — ${name.trim()}` : ""
  }`;

  return (
    <form
      action={`https://formsubmit.co/${brand.email}`}
      method="POST"
      acceptCharset="UTF-8"
      className="relative space-y-5"
    >
      <input type="hidden" name="_next" value={nextUrl} />
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_honey" tabIndex={-1} autoComplete="off" />
      <input
        type="hidden"
        name="Tegund"
        value={isBooking ? "Bókun mælingar" : "Hafa samband"}
      />

      <Field label="Nafn" htmlFor={`${kind}-name`}>
        <Input
          id={`${kind}-name`}
          name="Nafn"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11 rounded-none"
        />
      </Field>
      <Field label="Netfang" htmlFor={`${kind}-email`}>
        <Input
          id={`${kind}-email`}
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-none"
        />
      </Field>
      <Field label="Sími" htmlFor={`${kind}-phone`}>
        <Input
          id={`${kind}-phone`}
          name="Sími"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 rounded-none"
        />
      </Field>
      {isBooking && (
        <Field label="Æskilegur tími" htmlFor={`${kind}-when`}>
          <Input
            id={`${kind}-when`}
            name="Æskilegur tími"
            placeholder="T.d. næsta vika, eftir vinnu, laugardag"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
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
          name="Skilaboð"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-28 rounded-none"
          placeholder={
            isBooking
              ? "Jakkaföt, jakki, skyrtur, brúðkaup…"
              : "Hvernig getum við aðstoðað?"
          }
        />
      </Field>
      <div className="flex flex-col items-start gap-3">
        <Button
          type="submit"
          disabled={!nextUrl}
          className="h-12 rounded-none bg-forest px-8 text-[11px] tracking-[0.18em] uppercase text-white hover:bg-forest-mid"
        >
          {isBooking ? "Senda bókun" : "Senda"}
        </Button>
        <a
          href={`mailto:${brand.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
            [
              isBooking ? "Bókun mælingar af vefnum." : "Fyrirspurn af vefnum.",
              "",
              `Nafn: ${name}`,
              `Netfang: ${email}`,
              `Sími: ${phone || "—"}`,
              ...(isBooking ? [`Æskilegur tími: ${when || "—"}`] : []),
              "",
              message,
            ].join("\n")
          )}`}
          className="text-sm text-forest/70 underline-offset-4 hover:text-forest hover:underline"
        >
          Eða senda beint úr póstforritinu
        </a>
      </div>
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
