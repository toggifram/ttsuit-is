export type ProductColor = {
  name: string;
  hex: string;
  image?: string;
  images?: string[];
  available?: boolean;
  sellingFast?: boolean;
};

export type ProductCategory =
  | "peysur"
  | "bindi"
  | "yfirhafnir"
  | "fylgihlutir"
  | "gjafabref";

export const shopCategories = [
  { id: "all", slug: "", label: "Allar vörur" },
  { id: "peysur", slug: "peysur", label: "Peysur" },
  { id: "yfirhafnir", slug: "yfirhafnir", label: "Yfirhafnir" },
  { id: "bindi", slug: "bindi", label: "Bindi" },
  { id: "fylgihlutir", slug: "fylgihluti", label: "Fylgihlutir" },
  { id: "gjafabref", slug: "gjafabref", label: "Gjafabréf" },
] as const;

export const categoryLooks = [
  {
    id: "all",
    label: "Allar vörur",
    href: "/verslun",
    image: "/images/studio/allar-vorur.jpg",
    alt: "Tjé Tjé poki og prjón",
    position: "center",
  },
  {
    id: "peysur",
    label: "Peysur",
    href: "/verslun/peysur",
    image: "/images/studio/navy-shawl.jpg",
    alt: "Navy cardigan",
    position: "top",
  },
  {
    id: "yfirhafnir",
    label: "Yfirhafnir",
    href: "/verslun/yfirhafnir",
    image: "/images/studio/yfirhafnir.jpg",
    alt: "Brúnn jakki",
    position: "top",
  },
  {
    id: "bindi",
    label: "Bindi",
    href: "/verslun/bindi",
    image: "/images/studio/bindi.jpg",
    alt: "Navy bindi með doppum",
    position: "center",
  },
  {
    id: "fylgihlutir",
    label: "Fylgihlutir",
    href: "/verslun/fylgihluti",
    image: "/images/studio/navy-detail.jpg",
    alt: "TJ merki á peysu",
    position: "center",
  },
  {
    id: "gjafabref",
    label: "Gjafabréf",
    href: "/verslun/gjafabref",
    image: "/images/studio/gift-card.jpg",
    alt: "Gjafabréf Tjé Tjé",
    position: "center",
  },
] as const;

export function isPackColor(name: string) {
  return /\d\s*x\b|,/.test(name);
}

export function hrefForCategory(id: (typeof shopCategories)[number]["id"]) {
  const row = shopCategories.find((cat) => cat.id === id);
  return row?.slug ? `/verslun/${row.slug}` : "/verslun";
}

export function productHref(handle: string, color?: string) {
  const path = `/verslun/vara/${handle}`;
  if (!color) return path;
  return `${path}?litur=${encodeURIComponent(color)}`;
}

export function categoryFromSlug(slug: string) {
  return shopCategories.find((cat) => cat.slug === slug) ?? null;
}

export function isGiftCardProduct(input: {
  handle?: string | null;
  title?: string | null;
  productType?: string | null;
  tags?: readonly string[] | null;
}) {
  const hay = [
    input.handle,
    input.title,
    input.productType,
    ...(input.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return /gift|gjafa|voucher/.test(hay);
}

export function categoryLabel(id: ProductCategory) {
  return shopCategories.find((cat) => cat.id === id)?.label ?? "Verslun";
}

export type ProductVariant = {
  id: string;
  title: string;
  price: string;
  priceAmount: number;
  available: boolean;
  quantityAvailable?: number;
  size?: string;
  color?: string;
  image?: string;
};

/** Units sold of one colourway before the badge appears. */
export const SELLING_FAST_SOLD_UNITS = 2;

export type StockBaseline = Record<string, number>;

export function variantStockKey(id: string) {
  return id.replace(/^gid:\/\/shopify\/ProductVariant\//, "");
}

export function mergeStockBaseline(
  current: StockBaseline,
  saved?: StockBaseline
): { baseline: StockBaseline; dirty: boolean } {
  if (!saved) return { baseline: { ...current }, dirty: true };
  const baseline = { ...saved };
  let dirty = false;
  for (const [id, qty] of Object.entries(current)) {
    if (typeof baseline[id] !== "number") {
      baseline[id] = qty;
      dirty = true;
    } else if (qty > baseline[id]) {
      baseline[id] = qty;
      dirty = true;
    }
  }
  return { baseline, dirty };
}

export function unitsSoldSinceBaseline(
  variants: { id: string; quantityAvailable?: number }[],
  baseline?: StockBaseline
) {
  if (!baseline) return 0;
  let sold = 0;
  for (const variant of variants) {
    if (typeof variant.quantityAvailable !== "number") continue;
    const start = baseline[variantStockKey(variant.id)];
    if (typeof start !== "number") continue;
    if (start > variant.quantityAvailable) {
      sold += start - variant.quantityAvailable;
    }
  }
  return sold;
}

export type Product = {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  imageAlt: string;
  price: string;
  badge?: string;
  colors: ProductColor[];
  category: ProductCategory;
  description?: string;
  images?: string[];
  sizes?: string[];
  variants?: ProductVariant[];
  shopifyUrl?: string;
  available?: boolean;
  sellingFast?: boolean;
};

export type CatalogListing = {
  key: string;
  product: Product;
  color?: ProductColor;
};

const CATEGORY_RANK: Record<ProductCategory, number> = {
  peysur: 0,
  yfirhafnir: 1,
  bindi: 2,
  fylgihlutir: 3,
  gjafabref: 4,
};

/** One card per color. Shop order: peysur, yfirhafnir, bindi, fylgihlutir, gjafabréf. Sold-out last in each group. */
export function catalogListings(products: Product[]): CatalogListing[] {
  const listings: CatalogListing[] = products.flatMap((product) => {
    if (!product.colors.length) {
      return [{ key: product.id, product }];
    }
    const colorImages = new Set(
      product.colors.map((color) => color.image || product.image)
    );
    if (colorImages.size <= 1) {
      return [{ key: product.id, product }];
    }
    return product.colors.map((color) => ({
      key: `${product.id}:${color.name}`,
      product,
      color,
    }));
  });
  return listings.sort((a, b) => {
    const category =
      (CATEGORY_RANK[a.product.category] ?? 99) -
      (CATEGORY_RANK[b.product.category] ?? 99);
    if (category !== 0) return category;
    const aStock = Number(isListingInStock(a.product, a.color));
    const bStock = Number(isListingInStock(b.product, b.color));
    return bStock - aStock;
  });
}

export function hasShopifyVariants(product: Product) {
  return (product.variants ?? []).some((variant) =>
    variant.id.includes("ProductVariant")
  );
}

export function findProductVariant(
  product: Product,
  size?: string,
  color?: string
) {
  const variants = product.variants ?? [];
  if (!variants.length) return undefined;

  const matches = variants.filter((variant) => {
    const sizeOk =
      !size ||
      variant.size === size ||
      variant.title === size ||
      variant.title.split(" / ").includes(size);
    const colorOk =
      !color ||
      variant.color === color ||
      variant.title.split(" / ").includes(color);
    return sizeOk && colorOk;
  });

  return matches.find((variant) => variant.available) ?? matches[0];
}

export function sizesForColor(product: Product, color?: string) {
  const all = product.sizes ?? [];
  if (!hasShopifyVariants(product) || !color) return all;
  const existing = new Set(
    (product.variants ?? [])
      .filter((variant) => !variant.color || variant.color === color)
      .map((variant) => variant.size)
      .filter((size): size is string => Boolean(size))
  );
  if (!existing.size) return all;
  const sizes = all.filter((size) => existing.has(size));
  if (sizes.length === 1 && /^ein stærð$/i.test(sizes[0])) return [];
  return sizes;
}

export function firstAvailableSize(product: Product, color?: string) {
  const sizes = sizesForColor(product, color);
  for (const size of sizes) {
    if (isSizeInStock(product, size, color)) return size;
  }
  return sizes[0] ?? "";
}

export function isSizeInStock(product: Product, size: string, color?: string) {
  if (!hasShopifyVariants(product)) return true;
  const variant = findProductVariant(product, size, color);
  return Boolean(variant?.available);
}

export function isListingInStock(product: Product, color?: ProductColor | string) {
  if (!hasShopifyVariants(product)) return product.available !== false;
  const colorName = typeof color === "string" ? color : color?.name;
  if (colorName) {
    const match = product.colors.find((item) => item.name === colorName);
    if (typeof match?.available === "boolean") return match.available;
    return (product.variants ?? []).some(
      (variant) => variant.color === colorName && variant.available
    );
  }
  return product.available !== false;
}

/** Badge only the colour that actually sold — never the rest of the category. */
export function listingSellingFast(
  product: Product,
  color?: ProductColor | string
) {
  if (!isListingInStock(product, color)) return false;
  const colorName = typeof color === "string" ? color : color?.name;
  if (colorName) {
    return Boolean(
      product.colors.find((item) => item.name === colorName)?.sellingFast
    );
  }
  if (product.colors.length) {
    return Boolean(product.colors[0]?.sellingFast);
  }
  return Boolean(product.sellingFast);
}

export function variantFewLeft(variant?: ProductVariant) {
  if (!variant?.available) return false;
  if (typeof variant.quantityAvailable !== "number") return false;
  return variant.quantityAvailable >= 1 && variant.quantityAvailable <= 2;
}

export function variantStock(variant?: ProductVariant) {
  if (!variant?.available) return 0;
  if (typeof variant.quantityAvailable === "number" && variant.quantityAvailable > 0) {
    return variant.quantityAvailable;
  }
  return 20;
}

export function imagesForSelectedColor(product: Product, color?: string) {
  if (color) {
    const match = product.colors.find((item) => item.name === color);
    if (match?.images?.length) return match.images;
    if (match?.image) return [match.image];
  }
  return productImages(product);
}

export function productImages(product: Product): string[] {
  const urls = [product.image, ...(product.images ?? [])];
  return [...new Set(urls.filter(Boolean))];
}

export function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

/** Keep the first product for each image so gift cards do not repeat in a row. */
export function uniqueByImage(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.image)) return false;
    seen.add(product.image);
    return true;
  });
}

export function formatMoney(amount: string | number, currency = "ISK") {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return "";
  if (currency === "ISK") {
    return `${Math.round(value).toLocaleString("is-IS")} kr.`;
  }
  return new Intl.NumberFormat("is-IS", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
