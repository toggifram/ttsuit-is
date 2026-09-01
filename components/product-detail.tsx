"use client";

import Link from "next/link";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import {
  categoryLabel,
  findProductVariant,
  hasShopifyVariants,
  hrefForCategory,
  productImages,
  type Product,
} from "@/lib/product";
import { cn } from "@/lib/utils";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const gallery = productImages(product);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const inStock = product.available !== false;
  const buyHref = product.shopifyUrl;
  const contactHref = "/hafa-samband";
  const isGift = product.category === "gjafabref";
  const shopifyBuy = hasShopifyVariants(product);
  const variant = findProductVariant(product, size || undefined);
  const variantAvailable = variant?.available !== false;

  const addToCart = () => {
    if (!variant) return;
    addItem({
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      image: product.image,
      href: product.href,
      size: variant.size || size || undefined,
      priceAmount: variant.priceAmount,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article>
      <div className="mx-auto max-w-[1440px] px-5 pt-8 md:px-10 md:pt-12">
        <nav
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink/45"
          aria-label="Brauðmolaslóð"
        >
          <Link href="/verslun" className="hover:text-ink">
            Verslun
          </Link>
          <span aria-hidden>/</span>
          <Link href={hrefForCategory(product.category)} className="hover:text-ink">
            {categoryLabel(product.category)}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink/70">{product.title}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 md:grid-cols-12 md:gap-12 md:px-10 md:py-12">
        <div className="md:col-span-7">
          <div
            className={cn(
              "relative aspect-[4/5] overflow-hidden",
              isGift ? "bg-[#1a1a1a]" : "bg-[#ebe6dc]"
            )}
          >
            <img
              src={gallery[active] ?? product.image}
              alt={product.imageAlt}
              className={
                isGift
                  ? "absolute inset-0 h-full w-full object-contain p-10"
                  : "absolute inset-0 h-full w-full object-cover object-top"
              }
            />
            {product.badge ? (
              <span className="absolute left-3 top-3 bg-black px-1.5 py-0.5 text-[10px] tracking-[0.12em] text-white">
                {product.badge}
              </span>
            ) : null}
          </div>
          {gallery.length > 1 ? (
            <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {gallery.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Mynd ${index + 1}`}
                  aria-current={index === active}
                  className={cn(
                    "relative aspect-square overflow-hidden bg-[#ebe6dc]",
                    index === active
                      ? "ring-1 ring-forest"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={src}
                    alt=""
                    className={
                      isGift
                        ? "absolute inset-0 h-full w-full object-contain bg-[#1a1a1a] p-2"
                        : "absolute inset-0 h-full w-full object-cover object-top"
                    }
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col md:col-span-5 md:pt-4">
          <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
            {product.subtitle}
          </p>
          <h1 className="mt-2 font-serif text-4xl text-forest md:text-5xl">
            {product.title}
          </h1>
          <p className="mt-4 text-lg font-semibold text-ink">{product.price}</p>

          {product.colors.length ? (
            <div className="mt-8">
              <p className="text-[11px] tracking-[0.18em] text-ink/50 uppercase">
                Litur
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color.name}
                    title={color.name}
                    className="inline-flex items-center gap-2 text-[13px] text-ink/70"
                  >
                    <span
                      className="size-4 border border-black/15"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.name}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {product.sizes?.length ? (
            <div className="mt-8">
              <p className="text-[11px] tracking-[0.18em] text-ink/50 uppercase">
                Stærð
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSize(value)}
                    className={cn(
                      "min-w-12 px-3 py-2 text-[13px] transition-colors",
                      size === value
                        ? "bg-forest text-white"
                        : "bg-cream text-ink hover:bg-forest/10"
                    )}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3">
            {inStock && variantAvailable ? (
              shopifyBuy && variant ? (
                <button
                  type="button"
                  onClick={addToCart}
                  className="inline-flex h-12 items-center justify-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
                >
                  {added ? "Bætt í körfu" : "Setja í körfu"}
                </button>
              ) : buyHref ? (
                <a
                  href={buyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
                >
                  Kaupa á Shopify
                </a>
              ) : (
                <Link
                  href={contactHref}
                  className="inline-flex h-12 items-center justify-center bg-forest px-7 text-sm text-white transition-colors hover:bg-forest-mid"
                >
                  {isGift ? "Kaupa gjafabréf" : "Spyrja um vöruna"}
                </Link>
              )
            ) : (
              <span className="inline-flex h-12 items-center justify-center bg-cream px-7 text-sm text-ink/50">
                Uppselt
              </span>
            )}
            {shopifyBuy ? (
              <p className="text-[12px] leading-relaxed text-ink/50">
                Sending og greiðsla fara fram í Shopify-kassanum — með þeim
                sendingarleiðum og kortum sem þú hefur sett upp þar.
              </p>
            ) : buyHref ? (
              <p className="text-[12px] leading-relaxed text-ink/50">
                Greiðsla fer fram í Shopify-versluninni. Þú opnar vöruna þar og
                klárar kaupin.
              </p>
            ) : (
              <p className="text-[12px] leading-relaxed text-ink/50">
                Þegar Shopify-kassinn er tengdur fer sending og greiðsla í gegn
                um Shopify. Þangað til sendum við pöntunina eftir línu.
              </p>
            )}
          </div>

          {product.description ? (
            <p className="mt-10 max-w-md text-[15px] leading-relaxed text-ink/70">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>

      {related.length ? (
        <section className="border-t border-border bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-14">
            <h2 className="text-center font-serif text-3xl text-forest">
              Meira í sama flokki
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-white md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
