"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/product";
import {
  addressLooksComplete,
  listShippingMethods,
  shippingPriceText,
} from "@/lib/shipping";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 rounded-none border-border bg-white text-[15px] md:text-[15px]";

const shippingMethods = listShippingMethods();

export function CheckoutForm() {
  const { items, totalAmount, clear, setOpen } = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [addressReady, setAddressReady] = useState(false);
  const [shippingId, setShippingId] = useState(shippingMethods[0]?.id ?? "");

  const selected = useMemo(
    () => shippingMethods.find((row) => row.id === shippingId) ?? null,
    [shippingId]
  );

  if (!items.length) {
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Kassi
        </p>
        <h1 className="mt-3 font-serif text-4xl text-forest">Karfan er tóm</h1>
        <p className="mt-4 text-ink/60">
          Settu vöru í körfu áður en þú gengur frá kaupum.
        </p>
        <Link
          href="/verslun"
          className="mt-8 inline-flex h-12 items-center bg-forest px-7 text-sm text-white hover:bg-forest-mid"
        >
          Skoða verslun
        </Link>
      </section>
    );
  }

  function syncAddress(form: HTMLFormElement) {
    const data = new FormData(form);
    const ready = addressLooksComplete({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      address1: String(data.get("address1") ?? ""),
      city: String(data.get("city") ?? ""),
      zip: String(data.get("zip") ?? ""),
    });
    setAddressReady(ready);
    if (ready && !shippingId && shippingMethods[0]) {
      setShippingId(shippingMethods[0].id);
    }
  }

  async function pay(form: HTMLFormElement) {
    if (!selected) {
      setError("Veldu sendingarleið.");
      return;
    }
    setPending(true);
    setError("");
    const data = new FormData(form);
    const fullName = String(data.get("name") ?? "").trim();
    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(" ") || firstName;
    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          discountCode: String(data.get("discount") ?? "").trim(),
          shippingMethodId: selected.id,
          address: {
            email: String(data.get("email") ?? ""),
            phone: String(data.get("phone") ?? ""),
            firstName,
            lastName,
            address1: String(data.get("address1") ?? ""),
            address2: String(data.get("address2") ?? ""),
            city: String(data.get("city") ?? ""),
            zip: String(data.get("zip") ?? ""),
          },
        }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setError(json.error || "Gat ekki opnað greiðslu.");
        return;
      }
      clear();
      window.location.href = json.url;
    } catch {
      setError("Gat ekki opnað greiðslu.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-12 md:px-10 md:py-20"
      onInput={(event) => syncAddress(event.currentTarget)}
      onChange={(event) => syncAddress(event.currentTarget)}
      onBlur={(event) => syncAddress(event.currentTarget)}
      onSubmit={(event) => {
        event.preventDefault();
        void pay(event.currentTarget);
      }}
    >
      <div className="md:col-span-7">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Kassi
        </p>
        <h1 className="mt-3 font-serif text-4xl text-forest md:text-5xl">
          Sending og greiðsla
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/65">
          Settu inn heimilisfang — þá birtast sendingarleiðir við pöntunina.
          Kortagreiðsla fer fram á öruggum Shopify-kassa.
        </p>

        <div className="mt-10 space-y-5">
          <Field label="Nafn" htmlFor="kassi-name">
            <Input
              id="kassi-name"
              name="name"
              required
              autoComplete="name"
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Netfang" htmlFor="kassi-email">
              <Input
                id="kassi-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={fieldClass}
              />
            </Field>
            <Field label="Sími" htmlFor="kassi-phone">
              <Input
                id="kassi-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={fieldClass}
              />
            </Field>
          </div>
          <Field label="Heimilisfang" htmlFor="kassi-address">
            <Input
              id="kassi-address"
              name="address1"
              required
              autoComplete="street-address"
              className={fieldClass}
            />
          </Field>
          <Field label="Íbúð / hæð (valfrjálst)" htmlFor="kassi-address2">
            <Input
              id="kassi-address2"
              name="address2"
              autoComplete="address-line2"
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Póstnúmer" htmlFor="kassi-zip">
              <Input
                id="kassi-zip"
                name="zip"
                required
                autoComplete="postal-code"
                className={fieldClass}
              />
            </Field>
            <Field label="Bær" htmlFor="kassi-city">
              <Input
                id="kassi-city"
                name="city"
                required
                autoComplete="address-level2"
                className={fieldClass}
              />
            </Field>
          </div>
          <Field label="Afsláttarkóði" htmlFor="kassi-discount">
            <Input
              id="kassi-discount"
              name="discount"
              className={fieldClass}
            />
          </Field>
        </div>

        {error ? (
          <p className="mt-6 max-w-lg text-[13px] leading-relaxed text-red-800">
            {error}
          </p>
        ) : null}
      </div>

      <aside className="bg-cream p-6 md:col-span-5 md:p-8">
        <div>
          <h2 className="font-serif text-2xl text-forest">Sending</h2>
          {addressReady && shippingMethods.length ? (
            <fieldset className="mt-4">
              <legend className="sr-only">Sendingarleið</legend>
              <div className="space-y-2">
                {shippingMethods.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-start justify-between gap-4 border px-4 py-3",
                      shippingId === option.id
                        ? "border-forest bg-white"
                        : "border-border bg-white/70"
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        className="mt-1 accent-forest"
                        checked={shippingId === option.id}
                        onChange={() => setShippingId(option.id)}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-ink">
                          {option.title}
                        </span>
                        {option.description ? (
                          <span className="mt-0.5 block text-[12px] text-ink/50">
                            {option.description}
                          </span>
                        ) : null}
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">
                      {shippingPriceText(option)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ) : (
            <p className="mt-3 text-[13px] leading-relaxed text-ink/50">
              Settu inn heimilisfang til að sjá sendingarleiðir.
            </p>
          )}
        </div>

        <h2 className="mt-8 font-serif text-2xl text-forest">Pöntun</h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-3">
              <div className="relative size-16 shrink-0 overflow-hidden bg-[#ebe6dc]">
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{item.title}</p>
                {item.color || item.size ? (
                  <p className="text-[12px] text-ink/50">
                    {[item.color, item.size].filter(Boolean).join(" · ")}
                  </p>
                ) : null}
                <p className="text-[12px] text-ink/50">{item.quantity} stk.</p>
              </div>
              <p className="text-[13px] font-semibold">
                {formatMoney(item.priceAmount * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/55">Vörur</span>
            <span>{formatMoney(totalAmount)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-ink/55">Sending</span>
            <span className="text-right">
              {selected && addressReady ? shippingPriceText(selected) : "—"}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Samtals</span>
            <span>
              {formatMoney(totalAmount + (selected?.priceAmount ?? 0))}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
          Þú greiðir á Shopify. Sendingin sem þú velur hér fylgir með pöntuninni.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex h-12 w-full items-center justify-center bg-forest px-7 text-sm text-white hover:bg-forest-mid disabled:opacity-60"
        >
          {pending ? "Opna greiðslu…" : "Greiða"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 w-full text-center text-[13px] text-forest underline-offset-4 hover:underline"
        >
          Breyta körfu
        </button>
      </aside>
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
