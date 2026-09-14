"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product-gallery";
import { useCart } from "@/components/cart-provider";
import { SizeChartPanel } from "@/components/size-chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sizeChartFor } from "@/lib/size-charts";
import {
  catalogListings,
  categoryLabel,
  findProductVariant,
  firstAvailableSize,
  hasShopifyVariants,
  hrefForCategory,
  imagesForSelectedColor,
  isListingInStock,
  isSizeInStock,
  listingSellingFast,
  productHref,
  sizesForColor,
  variantFewLeft,
  variantStock,
  type Product,
} from "@/lib/product";
import { cn } from "@/lib/utils";

function productInfoRows(product: Product) {
  const info =
    product.description?.trim() ||
    `${product.title} frá Tjé Tjé. ${product.subtitle}.`;
  const sizeFit = product.sizes?.length
    ? `Stærðir: ${product.sizes.join(", ")}. Sjáðu vöruupplýsingar um fyrirmynd og snið. Ef þú ert á milli stærða, veldu þá stærri.`
    : "Ein stærð. Sjáðu mál á myndum eða sendu línu ef þú ert í vafa.";

  return [
    { title: "Vöruupplýsingar", body: info },
    { title: "Stærð og snið", body: sizeFit },
    {
      title: "Sending og skil",
      body: "Sendingarleið velurðu á kassanum. Kortagreiðsla fer um Teya. Þú getur skilað ónotaðri vöru í upprunalegum umbúðum. Hafðu samband á ttsuit@ttsuit.is.",
    },
  ];
}

export function ProductDetail({
  product,
  related,
  initialColor,
}: {
  product: Product;
  related: Product[];
  initialColor?: string;
}) {
  const startColor =
    product.colors.find((item) => item.name === initialColor)?.name ??
    product.colors[0]?.name ??
    "";
  const [color, setColor] = useState(startColor);
  const [size, setSize] = useState(firstAvailableSize(product, startColor));
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const { addItem } = useCart();
  const inStock = product.available !== false;
  const buyHref = product.shopifyUrl;
  const contactHref = "/hafa-samband";
  const isGift = product.category === "gjafabref";
  const shopifyBuy = hasShopifyVariants(product);
  const gallery = imagesForSelectedColor(product, color || undefined);
  const sizes = sizesForColor(product, color || undefined);
  const colorSoldOut = !isListingInStock(product, color || undefined);
  const sellingFast = listingSellingFast(product, color || undefined);
  const variant = findProductVariant(
    product,
    size || undefined,
    color || undefined
  );
  const variantAvailable = Boolean(variant?.available);
  const canAdd =
    shopifyBuy && variant ? variantAvailable : inStock;
  const fewLeft = !colorSoldOut && variantFewLeft(variant);
  const sizeChart = sizeChartFor(product.handle);

  useEffect(() => {
    if (active >= gallery.length) setActive(0);
  }, [active, gallery.length]);

  const selectColor = (name: string) => {
    setColor(name);
    setActive(0);
    setSize((current) =>
      isSizeInStock(product, current, name)
        ? current
        : firstAvailableSize(product, name)
    );
    window.history.replaceState(null, "", productHref(product.handle, name));
  };

  const addToCart = () => {
    if (!variant || !canAdd) return;
    addItem({
      variantId: variant.id,
      handle: product.handle,
      title: product.title,
      image: gallery[0] ?? variant.image ?? product.image,
      href: productHref(product.handle, variant.color || color || undefined),
      size: variant.size || size || undefined,
      color: variant.color || color || undefined,
      priceAmount: variant.priceAmount,
      quantityAvailable: variantStock(variant),
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
          <ProductGallery
            images={gallery.length ? gallery : [product.image]}
            alt={product.imageAlt}
            isGift={isGift}
            badge={product.badge}
            sellingFast={!colorSoldOut && sellingFast}
            soldOut={colorSoldOut}
            active={active}
            onChange={setActive}
          />
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
                {color ? (
                  <span className="ml-2 tracking-normal text-ink/70 normal-case">
                    {color}
                  </span>
                ) : null}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {product.colors.map((item) => {
                  const selected = color === item.name;
                  const soldOut = item.available === false;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => selectColor(item.name)}
                      title={soldOut ? `${item.name}, uppselt` : item.name}
                      aria-label={soldOut ? `${item.name}, uppselt` : item.name}
                      aria-pressed={selected}
                      className={cn(
                        "size-8 border transition-shadow",
                        soldOut && "opacity-40",
                        selected
                          ? "border-forest ring-1 ring-forest ring-offset-2"
                          : "border-black/15 hover:border-forest/50"
                      )}
                      style={{ backgroundColor: item.hex }}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {sizes.length ? (
            <div className="mt-8">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[11px] tracking-[0.18em] text-ink/50 uppercase">
                  Stærð
                </p>
                {sizeChart ? (
                  <button
                    type="button"
                    onClick={() => setSizeChartOpen(true)}
                    className="text-[12px] text-forest underline-offset-4 hover:underline"
                  >
                    Stærðartafla
                  </button>
                ) : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((value) => {
                  const inStockSize = isSizeInStock(product, value, color || undefined);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        if (inStockSize) setSize(value);
                      }}
                      disabled={!inStockSize}
                      aria-label={
                        inStockSize ? value : `${value}, uppselt`
                      }
                      className={cn(
                        "min-w-12 px-3 py-2 text-[13px] transition-colors",
                        !inStockSize
                          ? "cursor-not-allowed bg-cream text-ink/30 line-through"
                          : size === value
                            ? "bg-forest text-white"
                            : "bg-cream text-ink hover:bg-forest/10"
                      )}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
              {colorSoldOut ? (
                <p className="mt-3 text-[12px] text-ink/50">
                  Uppselt í þessum lit.
                </p>
              ) : fewLeft ? (
                <p className="mt-3 text-[12px] text-forest" aria-live="polite">
                  Fá eintök eftir
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3">
            {!sizes.length && fewLeft ? (
              <p className="text-[12px] text-forest" aria-live="polite">
                Fá eintök eftir
              </p>
            ) : null}
            {canAdd ? (
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
                Kortagreiðsla fer um Teya.
              </p>
            ) : buyHref ? (
              <p className="text-[12px] leading-relaxed text-ink/50">
                Greiðsla fer um Teya í Shopify-kassanum.
              </p>
            ) : (
              <p className="text-[12px] leading-relaxed text-ink/50">
                Þegar kassinn er tengdur fer sending um Shopify og greiðsla um
                Teya. Þangað til sendum við pöntunina eftir línu.
              </p>
            )}
          </div>

          <div className="mt-10 border-t border-forest/10">
            {productInfoRows(product).map((row) => (
              <details
                key={row.title}
                className="group border-b border-forest/10 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-[15px] font-semibold text-ink">
                    {row.title}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 text-lg leading-none text-ink/40 transition group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 max-w-md pr-8 text-[14px] leading-relaxed text-ink/70">
                  {row.body}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {sizeChart ? (
        <Dialog open={sizeChartOpen} onOpenChange={setSizeChartOpen}>
          <DialogContent className="flex max-h-[min(92dvh,40rem)] w-[calc(100%-1rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-none border border-border bg-white p-0 sm:w-[calc(100%-2rem)] sm:max-w-4xl">
            <DialogHeader className="shrink-0 border-b border-border px-4 py-3 pr-12 sm:px-6 sm:py-4">
              <DialogTitle className="font-serif text-xl text-forest sm:text-2xl">
                {sizeChart.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Stærðartafla í sentímetrum. Smelltu á X til að loka.
              </DialogDescription>
            </DialogHeader>
            <SizeChartPanel chart={sizeChart} selectedSize={size} />
          </DialogContent>
        </Dialog>
      ) : null}

      {related.length ? (
        <section className="border-t border-border bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-10 md:py-14">
            <h2 className="text-center font-serif text-3xl text-forest">
              Meira í sama flokki
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 bg-white px-2 sm:px-3 md:grid-cols-4 lg:px-6">
            {catalogListings(related).slice(0, 8).map((listing) => (
              <ProductCard
                key={listing.key}
                product={listing.product}
                color={listing.color}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
