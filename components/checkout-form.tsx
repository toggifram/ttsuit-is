"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useCart } from "@/components/cart-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/product";
import { cn } from "@/lib/utils";
import type { CartQuote, DeliveryOption } from "@/lib/shopify-cart";

const fieldClass =
  "h-12 rounded-none border-border bg-white text-[15px] md:text-[15px]";

export function CheckoutForm() {
  const { items, totalAmount, clear, setOpen } = useCart();
  const [pending, setPending] = useState<"quote" | "pay" | "">("");
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [shippingHandle, setShippingHandle] = useState("");

  const selected = useMemo(
    () => quote?.shipping.find((row) => row.handle === shippingHandle) ?? null,
    [quote, shippingHandle]
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

  async function quoteRates(form: HTMLFormElement) {
    setPending("quote");
    setError("");
    const data = new FormData(form);
    const fullName = String(data.get("name") ?? "").trim();
    const [firstName, ...rest] = fullName.split(/\s+/);
    const lastName = rest.join(" ") || firstName;
    try {
      const res = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
          discountCode: String(data.get("discount") ?? "").trim(),
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
      const json = (await res.json()) as CartQuote & { error?: string };
      if (!res.ok) {
        setQuote(null);
        setError(json.error || "Gat ekki sótt sendingarleiðir.");
        return;
      }
      setQuote(json);
      setShippingHandle(json.shipping[0]?.handle ?? "");
      if (!json.shipping.length) {
        setError(
          "Engar sendingarleiðir fundust. Athugaðu Settings → Shipping í Shopify, eða greiddu og veldu sendingu í kassanum."
        );
      }
    } catch {
      setError("Gat ekki sótt sendingarleiðir.");
    } finally {
      setPending("");
    }
  }

  async function pay() {
    if (!quote) {
      setError("Sæktu sendingarleiðir áður en þú greiðir.");
      return;
    }
    setPending("pay");
    setError("");
    try {
      const shipping: DeliveryOption | undefined = selected ?? quote.shipping[0];
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: quote.cartId,
          groupId: shipping?.groupId,
          handle: shipping?.handle,
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
      setPending("");
    }
  }

  return (
    <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-12 md:px-10 md:py-20">
      <div className="md:col-span-7">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Kassi
        </p>
        <h1 className="mt-3 font-serif text-4xl text-forest md:text-5xl">
          Sending og greiðsla
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/65">
          Heimilisfang og sendingarleiðir eru sótt hingað inn úr Shopify.
          Kortagreiðsla fer fram á öruggum Shopify-kassa — pöntunin skráist
          samt í þinni verslun.
        </p>

        <form
          className="mt-10 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            void quoteRates(event.currentTarget);
          }}
        >
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

          <button
            type="submit"
            disabled={pending === "quote"}
            className="inline-flex h-12 items-center bg-forest px-7 text-sm text-white hover:bg-forest-mid disabled:opacity-60"
          >
            {pending === "quote" ? "Sæki sendingu…" : "Sækja sendingarleiðir"}
          </button>
        </form>

        {quote?.shipping.length ? (
          <fieldset className="mt-10">
            <legend className="text-[11px] tracking-[0.18em] text-ink/50 uppercase">
              Sending
            </legend>
            <div className="mt-3 space-y-2">
              {quote.shipping.map((option) => (
                <label
                  key={option.handle}
                  className={cn(
                    "flex cursor-pointer items-start justify-between gap-4 border px-4 py-3",
                    shippingHandle === option.handle
                      ? "border-forest bg-cream"
                      : "border-border bg-white"
                  )}
                >
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      className="mt-1"
                      checked={shippingHandle === option.handle}
                      onChange={() => setShippingHandle(option.handle)}
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
                    {option.price}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {error ? (
          <p className="mt-6 max-w-lg text-[13px] leading-relaxed text-red-800">
            {error}
          </p>
        ) : null}
      </div>

      <aside className="bg-cream p-6 md:col-span-5 md:p-8">
        <h2 className="font-serif text-2xl text-forest">Pöntun</h2>
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
                {item.size ? (
                  <p className="text-[12px] text-ink/50">{item.size}</p>
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
            <span>{quote?.subtotal ?? formatMoney(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/55">Sending</span>
            <span>{selected ? selected.price : "—"}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Samtals</span>
            <span>
              {selected && quote
                ? formatMoney(quote.subtotalAmount + selected.priceAmount)
                : (quote?.total ?? formatMoney(totalAmount))}
            </span>
          </div>
        </div>
        <p className="mt-4 text-[12px] leading-relaxed text-ink/50">
          Þú greiðir á Shopify. Sendingin sem þú velur hér fylgir með.
        </p>
        <button
          type="button"
          onClick={() => void pay()}
          disabled={pending === "pay" || !quote}
          className="mt-6 inline-flex h-12 w-full items-center justify-center bg-forest px-7 text-sm text-white hover:bg-forest-mid disabled:opacity-60"
        >
          {pending === "pay" ? "Opna greiðslu…" : "Greiða"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-3 w-full text-center text-[13px] text-forest underline-offset-4 hover:underline"
        >
          Breyta körfu
        </button>
      </aside>
    </section>
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
