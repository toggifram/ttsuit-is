"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/product";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const { count, setOpen } = useCart();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => setOpen(true)}
      className={cn(
        "relative text-white hover:bg-white/10 hover:text-white",
        className
      )}
      aria-label={count ? `Karfa, ${count} vörur` : "Karfa"}
    >
      <ShoppingBag className="size-4" />
      {count > 0 ? (
        <span className="absolute top-1 right-1 flex min-w-4 items-center justify-center bg-white px-1 text-[10px] leading-4 font-semibold text-forest">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Button>
  );
}

export function CartDrawer() {
  const { items, totalAmount, open, setOpen, setQuantity, removeItem } =
    useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="w-full gap-0 border-border bg-white p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-serif text-2xl text-forest">
            Karfa
          </SheetTitle>
        </SheetHeader>

        {items.length ? (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.variantId} className="flex gap-3">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="relative size-20 shrink-0 overflow-hidden bg-[#ebe6dc]"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="text-[13px] font-semibold text-ink hover:underline"
                          >
                            {item.title}
                          </Link>
                          {item.color || item.size ? (
                            <p className="mt-0.5 text-[12px] text-ink/50">
                              {[item.color, item.size].filter(Boolean).join(" · ")}
                            </p>
                          ) : null}
                          <p className="mt-1 text-[13px] text-ink">
                            {formatMoney(item.priceAmount)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-ink/40 hover:text-ink"
                          aria-label={`Fjarlægja ${item.title}`}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                      <div className="mt-2 inline-flex items-center border border-border">
                        <button
                          type="button"
                          className="flex size-8 items-center justify-center text-ink/70 hover:bg-cream"
                          onClick={() =>
                            setQuantity(item.variantId, item.quantity - 1)
                          }
                          aria-label="Fækka"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-[13px]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="flex size-8 items-center justify-center text-ink/70 hover:bg-cream"
                          onClick={() =>
                            setQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label="Fjölga"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border bg-cream px-4 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Samtals</span>
                <span className="font-semibold text-ink">
                  {formatMoney(totalAmount)}
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-ink/50">
                Sendingarleiðir og heimilisfang fyllirðu út hér á síðunni.
                Kortagreiðsla fer síðan um Shopify.
              </p>
              <Link
                href="/kassi"
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex h-12 w-full items-center justify-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
              >
                Ganga frá kaupum
              </Link>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <ShoppingBag className="size-8 text-forest/30" />
            <p className="mt-4 font-serif text-2xl text-forest">Karfan er tóm</p>
            <p className="mt-2 max-w-xs text-sm text-ink/55">
              Settu vöru í körfu. Þegar Shopify er tengt gengur þú frá kaupum
              þar — sending og greiðsla innifalin.
            </p>
            <Link
              href="/verslun"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex h-12 items-center bg-forest px-7 text-sm text-white hover:bg-forest-mid"
            >
              Skoða verslun
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
