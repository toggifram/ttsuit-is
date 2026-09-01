import {
  formatMoney,
  productHref,
  shuffle,
  uniqueByImage,
  type Product,
  type ProductCategory,
  type ProductColor,
} from "@/lib/product";

const API_VERSION = "2025-01";

const COLOR_HEX: Record<string, string> = {
  navy: "#1e3a5f",
  "navy blue": "#1e3a5f",
  blue: "#2c4a6e",
  brown: "#5c3d2e",
  "dark brown": "#4a2f24",
  olive: "#5c5a3a",
  green: "#043034",
  forest: "#043034",
  black: "#1a1a1a",
  grey: "#6b6b6b",
  gray: "#6b6b6b",
  charcoal: "#3d3d3d",
  taupe: "#8a7a6b",
  beige: "#c4b49a",
  cream: "#f0e6d8",
  white: "#f4f1ea",
  offwhite: "#f4f1ea",
  "off-white": "#f4f1ea",
  red: "#7a1f1f",
  burgundy: "#5a1c24",
};

const PRODUCT_FIELDS = `
  id
  title
  handle
  productType
  tags
  description
  onlineStoreUrl
  featuredImage {
    url(transform: { maxWidth: 1400 })
    altText
  }
  images(first: 8) {
    nodes {
      url(transform: { maxWidth: 1400 })
      altText
    }
  }
  priceRange {
    minVariantPrice {
      amount
      currencyCode
    }
  }
  options {
    name
    values
  }
  variants(first: 40) {
    nodes {
      availableForSale
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query HomeProducts {
    products(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ${PRODUCT_FIELDS}
      }
    }
  }
`;

const PRODUCT_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ${PRODUCT_FIELDS}
    }
  }
`;

type ShopifyImage = { url: string; altText: string | null };

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  productType: string | null;
  tags: string[];
  description?: string | null;
  onlineStoreUrl: string | null;
  featuredImage: ShopifyImage | null;
  images?: { nodes: ShopifyImage[] };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  options: { name: string; values: string[] }[];
  variants?: { nodes: { availableForSale: boolean }[] };
};

function storeDomain() {
  return (process.env.SHOPIFY_STORE_DOMAIN || "tje-tje.myshopify.com")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

function colorHex(name: string) {
  const key = name.trim().toLowerCase();
  return COLOR_HEX[key] ?? "#8a8a8a";
}

function badgeFromTags(tags: string[]) {
  const joined = tags.map((t) => t.toLowerCase());
  if (joined.some((t) => t === "new" || t.includes("nýtt") || t.includes("nytt"))) {
    return "NÝTT";
  }
  if (joined.some((t) => t.includes("mix") || t.includes("match"))) {
    return "MIX & MATCH";
  }
  if (joined.some((t) => t.includes("sale") || t.includes("tilboð") || t.includes("tilbod"))) {
    return "TILBOÐ";
  }
  return undefined;
}

function categoryFrom(node: ShopifyProduct): ProductCategory {
  const hay = `${node.productType ?? ""} ${node.tags.join(" ")} ${node.title}`.toLowerCase();
  if (/gift|gjafa|voucher/.test(hay)) return "gjafabref";
  if (/\btie\b|bindi|bow tie|slaufa/.test(hay)) return "bindi";
  if (/coat|outerwear|yfirhafn|frakki|overshirt|parka|overcoat/.test(hay)) {
    return "yfirhafnir";
  }
  if (/accessor|fylgi|belt|scarf|pocket|cuff|bracelet|klút/.test(hay)) {
    return "fylgihlutir";
  }
  return "peysur";
}

function optionValues(node: ShopifyProduct, pattern: RegExp) {
  return node.options.find((option) => pattern.test(option.name))?.values ?? [];
}

function mapProduct(node: ShopifyProduct, domain: string): Product | null {
  const gallery = (node.images?.nodes ?? [])
    .map((image) => image.url)
    .filter(Boolean);
  const featured = node.featuredImage?.url ?? gallery[0];
  if (!featured) return null;

  const colors: ProductColor[] = optionValues(node, /color|colour|litur/i)
    .slice(0, 8)
    .map((name) => ({ name, hex: colorHex(name) }));
  const sizes = optionValues(node, /size|stærð|staerd|sterrd/i);
  const available =
    node.variants?.nodes.some((variant) => variant.availableForSale) ?? true;
  const extraImages = gallery.filter((url) => url !== featured);

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    subtitle: node.productType?.trim() || "Ready to wear",
    href: productHref(node.handle),
    shopifyUrl:
      node.onlineStoreUrl || `https://${domain}/products/${node.handle}`,
    image: featured,
    imageAlt: node.featuredImage?.altText || node.title,
    images: extraImages.length ? extraImages : undefined,
    description: node.description?.trim() || undefined,
    price: formatMoney(
      node.priceRange.minVariantPrice.amount,
      node.priceRange.minVariantPrice.currencyCode
    ),
    badge: badgeFromTags(node.tags),
    colors,
    sizes: sizes.length ? sizes : undefined,
    category: categoryFrom(node),
    available,
  };
}

type ShopifyJson<T> = {
  data?: T;
  errors?: { message?: string }[];
};

async function shopifyGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const domain = storeDomain();
  if (!token) return null;

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as ShopifyJson<T>;
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export async function fetchShopifyProducts(): Promise<Product[] | null> {
  const data = await shopifyGraphql<{ products?: { nodes: ShopifyProduct[] } }>(
    PRODUCTS_QUERY
  );
  if (!data?.products?.nodes?.length) return null;

  const domain = storeDomain();
  return data.products.nodes
    .map((node) => mapProduct(node, domain))
    .filter((item): item is Product => item !== null);
}

export async function fetchShopifyProduct(
  handle: string
): Promise<Product | null> {
  const data = await shopifyGraphql<{ product?: ShopifyProduct | null }>(
    PRODUCT_QUERY,
    { handle }
  );
  if (!data?.product) return null;
  return mapProduct(data.product, storeDomain());
}

/** Random products from every Shopify category, with a local fallback. */
export async function getHomeProducts(limit = 18): Promise<Product[]> {
  const { getCatalogProducts } = await import("./catalog");
  const all = await getCatalogProducts();
  return uniqueByImage(shuffle(all)).slice(0, Math.min(limit, all.length));
}
