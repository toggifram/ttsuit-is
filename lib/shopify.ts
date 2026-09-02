import {
  formatMoney,
  productHref,
  shuffle,
  uniqueByImage,
  type Product,
  type ProductCategory,
  type ProductColor,
  type ProductVariant,
} from "@/lib/product";
import {
  getAdminAccessToken,
  getStorefrontAccessToken,
  storeDomain,
} from "@/lib/shopify-auth";

const API_VERSION = "2025-01";

const COLOR_HEX: Record<string, string> = {
  navy: "#1e3a5f",
  "navy blue": "#1e3a5f",
  blue: "#2c4a6e",
  dökkblár: "#1a2744",
  dokkblar: "#1a2744",
  "dökk blár": "#1a2744",
  "dokk blar": "#1a2744",
  brown: "#5c3d2e",
  "dark brown": "#4a2f24",
  espressobrúnn: "#3b2a24",
  espressobrunn: "#3b2a24",
  olive: "#5c5a3a",
  ólífugrænn: "#5c5a3a",
  olifugraenn: "#5c5a3a",
  green: "#2f3d32",
  grænn: "#2f3d32",
  graenn: "#2f3d32",
  forest: "#043034",
  black: "#1a1a1a",
  svart: "#1a1a1a",
  brúnn: "#5c3d2e",
  brunn: "#5c3d2e",
  grey: "#6b6b6b",
  gray: "#6b6b6b",
  charcoal: "#3d3d3d",
  taupe: "#8a7a6b",
  sandur: "#c2ae93",
  sand: "#c2ae93",
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
  images(first: 16) {
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
      id
      title
      availableForSale
      quantityAvailable
      price {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      image {
        url(transform: { maxWidth: 1400 })
      }
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
  variants?: {
    nodes: {
      id?: string;
      title?: string;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      price?: { amount: string; currencyCode: string };
      selectedOptions?: { name: string; value: string }[];
      image?: { url: string } | null;
    }[];
  };
};

type AdminImage = { id?: number; src: string; alt: string | null };
type AdminOption = { name: string; values: string[] };
type AdminVariant = {
  id: number;
  title: string;
  price: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  image_id?: number | null;
  inventory_management: string | null;
  inventory_quantity?: number | null;
};

type AdminProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  product_type: string | null;
  tags: string;
  images: AdminImage[];
  options: AdminOption[];
  variants: AdminVariant[];
};

function publicCheckout() {
  return process.env.SHOPIFY_PUBLIC_CHECKOUT === "true";
}

function colorHex(name: string) {
  const key = name.trim().toLowerCase();
  const folded = foldKey(name);
  return COLOR_HEX[key] ?? COLOR_HEX[folded] ?? "#8a8a8a";
}

function foldKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function imagesForColor(
  images: ShopifyImage[],
  colorName: string
): string[] {
  const key = foldKey(colorName);
  if (!key) return [];
  return images
    .filter((image) => foldKey(image.altText ?? "").includes(key))
    .map((image) => image.url)
    .filter(Boolean);
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
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
  if (/coat|outerwear|yfirhafn|frakki|jakki|jakkar|overshirt|parka|overcoat/.test(hay)) {
    return "yfirhafnir";
  }
  if (
    /accessor|fylgi|belt|scarf|pocket|cuff|bracelet|armband|axlabond|klút|klutur|sokk|sock/.test(
      hay
    )
  ) {
    return "fylgihlutir";
  }
  return "peysur";
}

function optionValues(node: ShopifyProduct, pattern: RegExp) {
  return node.options.find((option) => pattern.test(option.name))?.values ?? [];
}

const SIZE_OPTION = /size|stærð|staerd|sterrd/i;
const COLOR_OPTION = /color|colour|litur/i;

function mapVariants(node: ShopifyProduct): ProductVariant[] {
  const currency = node.priceRange.minVariantPrice.currencyCode;
  return (node.variants?.nodes ?? [])
    .map((variant) => {
      const amount = variant.price?.amount ?? node.priceRange.minVariantPrice.amount;
      const size = variant.selectedOptions?.find((option) =>
        SIZE_OPTION.test(option.name)
      )?.value;
      const color = variant.selectedOptions?.find((option) =>
        COLOR_OPTION.test(option.name)
      )?.value;
      return {
        id: variant.id ?? "",
        title: variant.title || size || "Sjálfgefin",
        price: formatMoney(amount, variant.price?.currencyCode ?? currency),
        priceAmount: Number(amount),
        available: variant.availableForSale,
        quantityAvailable:
          typeof variant.quantityAvailable === "number"
            ? variant.quantityAvailable
            : undefined,
        size,
        color,
        image: variant.image?.url || undefined,
      };
    })
    .filter((variant) => variant.id.includes("ProductVariant"));
}

function mapProduct(node: ShopifyProduct, domain: string): Product | null {
  const galleryImages = node.images?.nodes ?? [];
  const gallery = galleryImages.map((image) => image.url).filter(Boolean);
  const featured = node.featuredImage?.url ?? gallery[0];
  if (!featured) return null;

  const variants = mapVariants(node);
  const colorNames = optionValues(node, COLOR_OPTION).slice(0, 8);
  const colors: ProductColor[] = colorNames.map((name) => {
    const fromAlt = imagesForColor(galleryImages, name);
    const fromVariant = variants.find(
      (variant) => variant.color === name && variant.image
    )?.image;
    const unique = [...new Set([...fromAlt, fromVariant].filter(Boolean))] as string[];
    return {
      name,
      hex: colorHex(name),
      image: unique[0],
      images: unique.length ? unique : undefined,
    };
  });
  const featuredColor = colors.find(
    (color) => color.images?.[0] === featured || color.image === featured
  );
  if (featuredColor) {
    colors.sort((a, b) => Number(b === featuredColor) - Number(a === featuredColor));
  }
  const sizes = optionValues(node, SIZE_OPTION);
  const available =
    variants.some((variant) => variant.available) ||
    (node.variants?.nodes.some((variant) => variant.availableForSale) ?? true);
  const extraImages = gallery.filter((url) => url !== featured);
  const shopifyUrl = publicCheckout()
    ? node.onlineStoreUrl || `https://${domain}/products/${node.handle}`
    : undefined;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    subtitle: node.productType?.trim() || "Ready to wear",
    href: productHref(node.handle),
    shopifyUrl,
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
    variants: variants.length ? variants : undefined,
    category: categoryFrom(node),
    available,
  };
}

function fromAdminProduct(product: AdminProduct): ShopifyProduct {
  const images = (product.images ?? []).map((image) => ({
    url: image.src,
    altText: image.alt,
  }));
  const tags = (product.tags ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  const price = product.variants?.[0]?.price ?? "0";

  return {
    id: `gid://shopify/Product/${product.id}`,
    title: product.title,
    handle: product.handle,
    productType: product.product_type,
    tags,
    description: stripHtml(product.body_html ?? ""),
    onlineStoreUrl: null,
    featuredImage: images[0] ?? null,
    images: { nodes: images },
    priceRange: {
      minVariantPrice: { amount: price, currencyCode: "ISK" },
    },
    options: (product.options ?? []).map((option) => ({
      name: option.name,
      values: option.values,
    })),
    variants: {
      nodes: (product.variants ?? []).map((variant) => {
        const optionNames = (product.options ?? []).map((option) => option.name);
        const selectedOptions = [variant.option1, variant.option2, variant.option3]
          .map((value, index) =>
            value
              ? { name: optionNames[index] ?? `Option${index + 1}`, value }
              : null
          )
          .filter((option): option is { name: string; value: string } =>
            Boolean(option)
          );
        return {
          id: `gid://shopify/ProductVariant/${variant.id}`,
          title: variant.title,
          availableForSale: variant.inventory_management
            ? (variant.inventory_quantity ?? 0) > 0
            : true,
          quantityAvailable: variant.inventory_management
            ? (variant.inventory_quantity ?? 0)
            : undefined,
          price: { amount: variant.price, currencyCode: "ISK" },
          selectedOptions,
          image: (() => {
            const src = (product.images ?? []).find(
              (row) => row.id === variant.image_id
            )?.src;
            return src ? { url: src } : null;
          })(),
        };
      }),
    },
  };
}

function nextLink(header: string | null) {
  if (!header) return null;
  const match = header.split(",").find((part) => part.includes('rel="next"'));
  const url = match?.match(/<([^>]+)>/)?.[1];
  return url ?? null;
}

async function adminFetch(url: string) {
  const token = await getAdminAccessToken();
  if (!token) return null;
  const res = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`Shopify Admin API ${res.status} ${url.replace(/https?:\/\/[^/]+/, "")}`);
    return null;
  }
  return res;
}

async function fetchAdminProducts(): Promise<Product[] | null> {
  if (!(await getAdminAccessToken())) return null;

  const domain = storeDomain();
  const collected: AdminProduct[] = [];
  let url: string | null =
    `https://${domain}/admin/api/${API_VERSION}/products.json?limit=250&status=active`;
  let pages = 0;

  while (url && pages < 8) {
    const res = await adminFetch(url);
    if (!res) return collected.length ? mapAdminList(collected, domain) : null;
    const json = (await res.json()) as { products?: AdminProduct[] };
    collected.push(...(json.products ?? []));
    url = nextLink(res.headers.get("link"));
    pages += 1;
  }

  return mapAdminList(collected, domain);
}

async function fetchAdminProduct(handle: string): Promise<Product | null> {
  if (!(await getAdminAccessToken())) return null;
  const domain = storeDomain();
  const res = await adminFetch(
    `https://${domain}/admin/api/${API_VERSION}/products.json?handle=${encodeURIComponent(handle)}&status=active&limit=1`
  );
  if (!res) return null;
  const json = (await res.json()) as { products?: AdminProduct[] };
  const product = json.products?.[0];
  if (!product) return null;
  return mapProduct(fromAdminProduct(product), domain);
}

function mapAdminList(products: AdminProduct[], domain: string) {
  const mapped = products
    .map((product) => mapProduct(fromAdminProduct(product), domain))
    .filter((item): item is Product => item !== null);
  return mapped.length ? mapped : null;
}

type ShopifyJson<T> = {
  data?: T;
  errors?: { message?: string }[];
};

async function shopifyGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  mutate = false
): Promise<T | null> {
  const token = await getStorefrontAccessToken();
  const domain = storeDomain();
  if (!token) return null;

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(mutate ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
  });
  if (!res.ok) return null;

  const json = (await res.json()) as ShopifyJson<T>;
  if (json.errors?.length) return null;
  return json.data ?? null;
}

async function fetchStorefrontProducts(): Promise<Product[] | null> {
  const data = await shopifyGraphql<{ products?: { nodes: ShopifyProduct[] } }>(
    PRODUCTS_QUERY
  );
  if (!data?.products?.nodes?.length) return null;

  const domain = storeDomain();
  return data.products.nodes
    .map((node) => mapProduct(node, domain))
    .filter((item): item is Product => item !== null);
}

async function fetchStorefrontProduct(handle: string): Promise<Product | null> {
  const data = await shopifyGraphql<{ product?: ShopifyProduct | null }>(
    PRODUCT_QUERY,
    { handle }
  );
  if (!data?.product) return null;
  return mapProduct(data.product, storeDomain());
}

/** Admin API first (works while the Online Store stays password-protected). */
export async function fetchShopifyProducts(): Promise<Product[] | null> {
  try {
    const admin = await fetchAdminProducts();
    if (admin?.length) return admin;
  } catch {
    // Fall through to Storefront.
  }
  return fetchStorefrontProducts();
}

export async function fetchShopifyProduct(
  handle: string
): Promise<Product | null> {
  try {
    const admin = await fetchAdminProduct(handle);
    if (admin) return admin;
  } catch {
    // Fall through to Storefront.
  }
  return fetchStorefrontProduct(handle);
}

/** Random products from every Shopify category, with a local fallback. */
export async function getHomeProducts(limit = 18): Promise<Product[]> {
  const { getCatalogProducts } = await import("./catalog");
  const all = await getCatalogProducts();
  return uniqueByImage(shuffle(all)).slice(0, Math.min(limit, all.length));
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        checkoutUrl
      }
      userErrors {
        message
      }
    }
  }
`;

export function toVariantGid(id: string) {
  if (id.startsWith("gid://")) return id;
  return `gid://shopify/ProductVariant/${id}`;
}

function variantNumericId(id: string) {
  const raw = id.startsWith("gid://") ? id.split("/").pop() : id;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

async function createStorefrontCheckout(
  lines: { variantId: string; quantity: number }[]
) {
  const data = await shopifyGraphql<{
    cartCreate?: {
      cart?: { checkoutUrl?: string | null } | null;
      userErrors?: { message: string }[];
    };
  }>(
    CART_CREATE,
    {
      lines: lines.map((line) => ({
        merchandiseId: toVariantGid(line.variantId),
        quantity: line.quantity,
      })),
    },
    true
  );
  const checkoutUrl = data?.cartCreate?.cart?.checkoutUrl;
  return checkoutUrl || null;
}

async function createDraftOrderCheckout(
  lines: { variantId: string; quantity: number }[]
) {
  if (!(await getAdminAccessToken())) return null;
  const domain = storeDomain();
  const lineItems = lines
    .map((line) => {
      const variant_id = variantNumericId(line.variantId);
      if (!variant_id) return null;
      return { variant_id, quantity: line.quantity };
    })
    .filter((item): item is { variant_id: number; quantity: number } =>
      Boolean(item)
    );
  if (!lineItems.length) return null;

  const res = await fetch(
    `https://${domain}/admin/api/${API_VERSION}/draft_orders.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": await getAdminAccessToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ draft_order: { line_items: lineItems } }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error(`Shopify draft order ${res.status}`);
    return null;
  }
  const json = (await res.json()) as {
    draft_order?: { invoice_url?: string | null };
  };
  return json.draft_order?.invoice_url || null;
}

export async function createShopifyCheckout(
  lines: { variantId: string; quantity: number }[]
): Promise<{ url: string } | { error: string }> {
  if (!lines.length) return { error: "Karfan er tóm." };

  try {
    const storefront = await createStorefrontCheckout(lines);
    if (storefront) return { url: storefront };
  } catch {
    // Fall through to a draft-order invoice.
  }

  try {
    const draft = await createDraftOrderCheckout(lines);
    if (draft) return { url: draft };
  } catch {
    // No checkout method available.
  }

  return {
    error:
      "Shopify-kassinn er ekki tilbúinn. Bættu Storefront-tóka við (karfa/checkout) eða `write_draft_orders` á Admin-appinu, og taktu lykilorðið af Online Store svo kassinn opnist.",
  };
}
