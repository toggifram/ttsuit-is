"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductImageBadges } from "@/components/product-image-badges";
import { listingSellingFast, shuffle, type Product } from "@/lib/product";
import { cn } from "@/lib/utils";

export function ProductRail({ products }: { products: Product[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [items, setItems] = useState(products);

  useEffect(() => {
    setItems(shuffle(products));
  }, [products]);

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scroller.current;
    const card = el?.firstElementChild as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 8), behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="bg-white px-2 pb-10 md:pb-14" aria-label="Vörur">
      <div className="relative">
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((product) => (
            <article
              key={product.id}
              className="w-[78%] shrink-0 snap-start bg-white sm:w-[48%] lg:w-[calc((100%-2rem)/5)]"
            >
              <Link href={product.href} className="block">
                <div
                  className={cn(
                    "relative aspect-[3/4] overflow-hidden",
                    product.category === "gjafabref"
                      ? "bg-[#1a1a1a]"
                      : "bg-[#ebe6dc]"
                  )}
                >
                  <img
                    src={product.image}
                    alt={product.imageAlt}
                    className={
                      product.category === "gjafabref"
                        ? "absolute inset-0 h-full w-full object-contain p-4"
                        : cn(
                            "absolute inset-0 h-full w-full object-cover object-top",
                            product.available === false && "opacity-70"
                          )
                    }
                  />
                  <ProductImageBadges
                    soldOut={product.available === false}
                    sellingFast={listingSellingFast(product)}
                    badge={product.badge}
                    compact
                  />
                </div>
                <div className="px-3 pb-6 pt-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[13px] font-semibold leading-snug text-ink">
                      {product.title}
                    </h3>
                    <p className="shrink-0 text-[13px] font-semibold text-ink">
                      {product.price}
                    </p>
                  </div>
                  <p className="mt-1 text-[12px] text-ink/55">{product.subtitle}</p>
                  {product.colors.length ? (
                    <div className="mt-3 flex flex-wrap items-center gap-1">
                      {product.colors.slice(0, 5).map((color) => (
                        <span
                          key={color.name}
                          title={color.name}
                          className="size-3.5 border border-black/15"
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                      {product.colors.length > 5 ? (
                        <span className="pl-1 text-[11px] text-ink/45">
                          + {product.colors.length - 5} í viðbót
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </Link>
            </article>
          ))}
        </div>

        <RailButton
          label="Fyrri vörur"
          side="left"
          disabled={!canPrev}
          onClick={() => scrollByCard(-1)}
        />
        <RailButton
          label="Næstu vörur"
          side="right"
          disabled={!canNext}
          onClick={() => scrollByCard(1)}
        />
      </div>
    </section>
  );
}

function RailButton({
  label,
  side,
  disabled,
  onClick,
}: {
  label: string;
  side: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute top-[40%] z-10 flex size-10 -translate-y-1/2 items-center justify-center bg-white text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.06)] transition-opacity",
        side === "left" ? "left-3" : "right-3",
        disabled && "pointer-events-none opacity-0"
      )}
    >
      <Icon className="size-5" strokeWidth={1.25} />
    </button>
  );
}
