import Link from "next/link";

import type { Product } from "@/lib/product";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <article className={cn("bg-white", className)}>
      <Link href={product.href} className="block">
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden",
            product.category === "gjafabref" ? "bg-[#1a1a1a]" : "bg-[#ebe6dc]"
          )}
        >
          <img
            src={product.image}
            alt={product.imageAlt}
            className={
              product.category === "gjafabref"
                ? "absolute inset-0 h-full w-full object-contain p-4"
                : "absolute inset-0 h-full w-full object-cover object-top"
            }
          />
          {product.badge ? (
            <span className="absolute left-2 top-2 bg-black px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-white">
              {product.badge}
            </span>
          ) : null}
        </div>
        <div className="px-3 pb-6 pt-3 text-left">
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
  );
}
