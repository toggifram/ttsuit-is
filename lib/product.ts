export type ProductColor = {
  name: string;
  hex: string;
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
  { id: "bindi", slug: "bindi", label: "Bindi" },
  { id: "yfirhafnir", slug: "yfirhafnir", label: "Yfirhafnir" },
  { id: "fylgihlutir", slug: "fylgihluti", label: "Fylgihluti" },
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
    id: "bindi",
    label: "Bindi",
    href: "/verslun/bindi",
    image: "/images/studio/bindi.jpg",
    alt: "Navy bindi með doppum",
    position: "center",
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
    id: "fylgihlutir",
    label: "Fylgihluti",
    href: "/verslun/fylgihluti",
    image: "/images/studio/navy-detail.jpg",
    alt: "TJ merki á peysu",
    position: "center",
  },
  {
    id: "gjafabref",
    label: "Gjafabréf",
    href: "/verslun/gjafabref",
    image: "/images/studio/gift-card.png",
    alt: "Gjafabréf Tjé Tjé",
    position: "center",
  },
] as const;

export function hrefForCategory(id: (typeof shopCategories)[number]["id"]) {
  const row = shopCategories.find((cat) => cat.id === id);
  return row?.slug ? `/verslun/${row.slug}` : "/verslun";
}

export function productHref(handle: string) {
  return `/verslun/vara/${handle}`;
}

export function categoryFromSlug(slug: string) {
  return shopCategories.find((cat) => cat.slug === slug) ?? null;
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
  size?: string;
  color?: string;
};

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
};

export function hasShopifyVariants(product: Product) {
  return (product.variants ?? []).some((variant) =>
    variant.id.includes("ProductVariant")
  );
}

export function findProductVariant(product: Product, size?: string) {
  const variants = product.variants ?? [];
  if (!variants.length) return undefined;
  if (size) {
    const match = variants.find(
      (variant) =>
        variant.size === size ||
        variant.title === size ||
        variant.title.split(" / ").includes(size)
    );
    if (match) return match;
  }
  return variants.find((variant) => variant.available) ?? variants[0];
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
