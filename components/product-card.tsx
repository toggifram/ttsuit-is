import Link from "next/link";

import { ProductImageBadges } from "@/components/product-image-badges";
import {
  isListingInStock,
  isPackColor,
  listingSellingFast,
  productHref,
  type Product,
  type ProductColor,
} from "@/lib/product";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  color,
  className,
}: {
  product: Product;
  color?: ProductColor;
  className?: string;
}) {
  const image = color?.images?.[0] || color?.image || product.image;
  const imageAlt = color
    ? `${product.title}, ${color.name}`
    : product.imageAlt;
  const href = productHref(product.handle, color?.name);
  const subtitle = color?.name ?? product.subtitle;
  const soldOut = !isListingInStock(product, color);
  const sellingFast = listingSellingFast(product, color);

  return (
    <article className={cn("bg-white", className)}>
      <Link href={href} className="block">
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden",
            product.category === "gjafabref" ? "bg-white" : "bg-[#ebe6dc]"
          )}
        >
          <img
            src={image}
            alt={imageAlt}
            className={
              product.category === "gjafabref"
                ? "absolute inset-0 h-full w-full object-contain p-4"
                : cn(
                    "absolute inset-0 h-full w-full object-cover object-top",
                    soldOut && "opacity-70"
                  )
            }
          />
          <ProductImageBadges
            soldOut={soldOut}
            sellingFast={sellingFast}
            badge={product.badge}
            compact
          />
        </div>
        <div className="px-3 pb-6 pt-3 text-left">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[13px] font-semibold leading-snug text-ink">
              {product.title}
            </h3>
            <p className="shrink-0 text-[13px] font-semibold text-ink">
              {product.category === "gjafabref" && (product.variants?.length ?? 0) > 1
                ? `frá ${product.price}`
                : product.price}
            </p>
          </div>
          <p className="mt-1 text-[12px] text-ink/55">{subtitle}</p>
          {product.colors.length && !product.colors.every((swatch) => isPackColor(swatch.name)) ? (
            <div className="mt-3 flex flex-wrap items-center gap-1">
              {product.colors.slice(0, 5).map((swatch) => (
                <span
                  key={swatch.name}
                  title={
                    swatch.available === false
                      ? `${swatch.name}, uppselt`
                      : swatch.name
                  }
                  className={cn(
                    "size-3.5 border border-black/15",
                    swatch.available === false && "opacity-35",
                    color?.name === swatch.name && "outline outline-1 outline-offset-1 outline-ink"
                  )}
                  style={{ backgroundColor: swatch.hex }}
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
