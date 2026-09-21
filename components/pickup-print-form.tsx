"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { PickupLabel, pickupLabelPrintHtml } from "@/components/pickup-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatIsPhone,
  formatOrderNumber,
  pickupLookupMessage,
  samplePickupLabel,
  type PickupLabelData,
} from "@/lib/pickup-label";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 rounded-none border-border bg-white text-[15px] md:text-[15px]";

type LookupResponse = {
  order?: PickupLabelData;
  orders?: PickupLabelData[];
  error?: string;
  code?: string;
};

export function PickupPrintForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shippingTitle, setShippingTitle] = useState("");
  const [recent, setRecent] = useState<PickupLabelData[]>([]);
  const [looking, setLooking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [tone, setTone] = useState<"ok" | "warn" | "error">("ok");

  const label = useMemo(
    () => ({
      name: name.trim(),
      phone: formatIsPhone(phone),
      orderNumber: formatOrderNumber(orderNumber),
    }),
    [name, phone, orderNumber]
  );

  const ready = Boolean(label.name && label.phone && label.orderNumber);

  const applyOrder = useCallback((order: PickupLabelData) => {
    setOrderNumber(order.orderNumber);
    setName(order.name);
    setPhone(order.phone);
    setShippingTitle(order.shippingTitle);
    if (!order.isPickup && order.shippingTitle) {
      setTone("warn");
      setMessage(
        `Þessi pöntun er merkt „${order.shippingTitle}“, ekki sækja. Þú getur samt prentað miða.`
      );
    } else {
      setTone("ok");
      setMessage(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/prentun?list=1")
      .then((res) => res.json() as Promise<LookupResponse>)
      .then((json) => {
        if (cancelled) return;
        setRecent(json.orders ?? []);
        if (json.code === "orders_scope") {
          setTone("warn");
          setMessage(json.error ?? pickupLookupMessage("orders_scope"));
        }
      })
      .catch(() => {
        if (!cancelled) setRecent([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "p") {
        if (!ready) return;
        event.preventDefault();
        printLabel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // printLabel is stable enough via ready + label values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, label.name, label.phone, label.orderNumber]);

  async function lookup(event?: React.FormEvent) {
    event?.preventDefault();
    const query = orderNumber.trim();
    if (!query) {
      setTone("error");
      setMessage("Settu inn pöntunarnúmer.");
      return;
    }
    setLooking(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/prentun?q=${encodeURIComponent(query)}`
      );
      const json = (await res.json()) as LookupResponse;
      if (json.order) {
        applyOrder(json.order);
        return;
      }
      setTone(json.code === "orders_scope" ? "warn" : "error");
      setMessage(json.error ?? "Pöntun fannst ekki.");
    } catch {
      setTone("error");
      setMessage("Gat ekki sótt pöntunina. Sláðu inn nafn og síma.");
    } finally {
      setLooking(false);
    }
  }

  function fillSample() {
    applyOrder(samplePickupLabel);
    setTone("ok");
    setMessage("Sýnishorn — prófaðu prentarann áður en alvöru poki fer út.");
  }

  function printLabel() {
    if (!ready) return;
    const html = pickupLabelPrintHtml(label);
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) {
      iframe.remove();
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();
    const frameWindow = iframe.contentWindow;
    if (!frameWindow) {
      iframe.remove();
      return;
    }
    const cleanup = () => {
      window.setTimeout(() => iframe.remove(), 400);
    };
    frameWindow.addEventListener("afterprint", cleanup, { once: true });
    frameWindow.focus();
    frameWindow.print();
    window.setTimeout(cleanup, 4000);
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-5 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-14 md:px-8 md:py-14">
      <div>
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Verslun
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest md:text-4xl">
          Sækja-miði
        </h1>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/70">
          80 × 50 mm miði á pokann. Nafn, sími og pöntunarnúmer. Notaðu þetta
          aðeins þegar viðskiptavinurinn velur sækja — Dropp fær áfram sína
          eigin sendingarmiða.
        </p>

        <form onSubmit={lookup} className="mt-8 space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <Label
                htmlFor="pickup-order"
                className="text-xs tracking-[0.14em] uppercase"
              >
                Pöntunarnúmer
              </Label>
              <Input
                id="pickup-order"
                name="orderNumber"
                inputMode="numeric"
                autoComplete="off"
                placeholder="1042"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                className={fieldClass}
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              disabled={looking}
              className="h-12 rounded-none px-5"
            >
              {looking ? "Sæki…" : "Sækja pöntun"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pickup-name"
              className="text-xs tracking-[0.14em] uppercase"
            >
              Nafn
            </Label>
            <Input
              id="pickup-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="pickup-phone"
              className="text-xs tracking-[0.14em] uppercase"
            >
              Símanúmer
            </Label>
            <Input
              id="pickup-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={fieldClass}
            />
          </div>

          {message ? (
            <p
              className={cn(
                "text-[13px] leading-relaxed",
                tone === "error" && "text-red-800",
                tone === "warn" && "text-ink/70",
                tone === "ok" && "text-forest"
              )}
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              onClick={printLabel}
              disabled={!ready}
              className="h-12 rounded-none px-6"
            >
              Prenta miða
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={fillSample}
              className="h-12 rounded-none px-6"
            >
              Prófa sýnishorn
            </Button>
          </div>
        </form>

        <p className="mt-6 max-w-lg text-[12px] leading-relaxed text-ink/50">
          Í prentglugganum: veldu pappír <span className="text-ink">80 × 50 mm</span>,
          spássíur <span className="text-ink">engar</span>, skala{" "}
          <span className="text-ink">100%</span>. Ef Dropp-prentarinn er stilltur
          á stærri miða þarf að skipta yfir á 80 × 50 rúlluna fyrst.
        </p>

        {shippingTitle ? (
          <p className="mt-3 text-[12px] text-ink/45">
            Sending í Shopify: {shippingTitle}
          </p>
        ) : null}

        {recent.length ? (
          <div className="mt-10">
            <p className="text-[11px] tracking-[0.18em] text-forest/55 uppercase">
              Nýlegar sækja-pantanir
            </p>
            <ul className="mt-3 divide-y divide-border border-y border-border">
              {recent.map((order) => (
                <li key={order.orderNumber}>
                  <button
                    type="button"
                    onClick={() => applyOrder(order)}
                    className="flex w-full items-baseline justify-between gap-4 py-3 text-left hover:bg-cream/80"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        {order.name || "Án nafns"}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-ink/50">
                        {order.phone || "Ekkert símanúmer"}
                      </span>
                    </span>
                    <span className="shrink-0 font-serif text-lg text-forest">
                      {order.orderNumber}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <aside className="md:sticky md:top-8">
        <p className="text-[11px] tracking-[0.18em] text-forest/55 uppercase">
          Forskoðun · 80 × 50 mm
        </p>
        <div className="mt-3 inline-block bg-[#ddd8ce] p-4 shadow-[0_18px_50px_rgba(4,48,52,0.08)]">
          <div
            className={cn(
              "border border-dashed border-forest/25 bg-white",
              !ready && "opacity-55"
            )}
          >
            <PickupLabel
              name={label.name}
              phone={label.phone}
              orderNumber={label.orderNumber}
            />
          </div>
        </div>
        <p className="mt-3 max-w-[80mm] text-[12px] leading-relaxed text-ink/50">
          {ready
            ? "Miðinn er tilbúinn. Límdu hann á pokann."
            : "Fylltu inn nafn, síma og pöntunarnúmer til að sjá miðann."}
        </p>
      </aside>
    </div>
  );
}
