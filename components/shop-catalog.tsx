"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import {
  shopCategories,
  type Product,
  type ProductCategory,
} from "@/lib/product";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

export function ShopCatalog({ products }: { products: Product[] }) {
  const [active, setActive] =
    useState<(typeof shopCategories)[number]["id"]>("all");
  const [page, setPage] = useState(0);

  const list = useMemo(() => {
    if (active === "all") return products;
    return products.filter((p) => p.category === (active as ProductCategory));
  }, [active, products]);

  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = list.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE
  );
  const activeLabel =
    shopCategories.find((cat) => cat.id === active)?.label ?? "Allar vörur";

  const selectCategory = (id: (typeof shopCategories)[number]["id"]) => {
    setActive(id);
    setPage(0);
  };

  return (
    <section id="verslun" className="bg-white" aria-label="Verslun">
      <div className="mx-auto max-w-[1440px] px-5 py-12 text-center md:px-10 md:py-16">
        <h2 className="font-serif text-4xl text-forest md:text-5xl">
          {activeLabel}
        </h2>
        <nav
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Vöruflokkar"
        >
          {shopCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectCategory(cat.id)}
              className={cn(
                "text-[13px] tracking-[0.01em] transition-colors",
                active === cat.id
                  ? "text-forest underline decoration-forest/40 underline-offset-8"
                  : "text-ink/40 hover:text-ink"
              )}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>

      {list.length ? (
        <div className="relative">
          <div className="grid grid-cols-2 gap-px bg-[#eeeae4] md:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pageCount > 1 ? (
            <>
              <PageButton
                label="Fyrri síða"
                side="left"
                disabled={safePage === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              />
              <PageButton
                label="Næsta síða"
                side="right"
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              />
              <p className="py-6 text-center text-[12px] tracking-[0.16em] text-ink/45 uppercase">
                {safePage + 1} / {pageCount}
              </p>
            </>
          ) : (
            <div className="h-6" />
          )}
        </div>
      ) : (
        <p className="px-5 pb-16 text-center text-sm text-ink/50">
          Engar vörur í þessum flokki enn. Þegar Shopify er tengt birtast þær
          hér.
        </p>
      )}
    </section>
  );
}

function PageButton({
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
        "absolute top-[38%] z-10 hidden size-10 -translate-y-1/2 items-center justify-center bg-white text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.06)] transition-opacity md:flex",
        side === "left" ? "left-3" : "right-3",
        disabled && "pointer-events-none opacity-0"
      )}
    >
      <Icon className="size-5" strokeWidth={1.25} />
    </button>
  );
}
