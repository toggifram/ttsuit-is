import {
  formatMoney,
  mergeStockBaseline,
  productHref,
  shuffle,
  uniqueByImage,
  unitsSoldSinceBaseline,
  SELLING_FAST_SOLD_UNITS,
  type Product,
  type ProductCategory,
  type ProductColor,
  type ProductVariant,
  type StockBaseline,
} from "@/lib/product";
import {
  getAdminAccessToken,
  getStorefrontAccessToken,
  storeDomain,
} from "@/lib/shopify-auth";

const API_VERSION = "2025-01";

const COLOR_HEX: Record<string, string> = {
  navy: "#1e3a5f",
  navyblár: "#1a2744",
  navyblar: "#1a2744",
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
  svartur: "#1a1a1a",
  svört: "#1a1a1a",
  svort: "#1a1a1a",
  blá: "#245ea8",
  bla: "#245ea8",
  grá: "#7a7a7a",
  gra: "#7a7a7a",
  brúnn: "#5c3d2e",
  brunn: "#5c3d2e",
  kamel: "#b56d32",
  camel: "#b56d32",
  steingrár: "#5a5a5a",
  steingrar: "#5a5a5a",
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
  images(first: 30) {
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
  inventory_policy?: string | null;
  inventory_quantity?: number | null;
};

type AdminProduct = {
  id: number;
  title: string;
  handle: string;
  body_html: string | null;
  product_type: string | null;
  tags: string;
  published_at?: string | null;
  status?: string;
  images: AdminImage[];
  options: AdminOption[];
  variants: AdminVariant[];
};

export type CheckoutVariantState = {
  variantId: string;
  productId: number;
  handle: string;
  title: string;
  status: string;
  published: boolean;
  purchasable: boolean;
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
    .replace(/[æÆ]/g, "ae")
    .replace(/[ðÐ]/g, "d")
    .replace(/[þÞ]/g, "th")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenFitsColor(token: string, colorKey: string) {
  if (!token || !colorKey) return false;
  if (token === colorKey) return true;
  const [short, long] =
    token.length <= colorKey.length ? [token, colorKey] : [colorKey, token];
  if (long.startsWith(short) && short.length >= 4) return true;
  let i = 0;
  while (i < token.length && i < colorKey.length && token[i] === colorKey[i]) {
    i += 1;
  }
  return i >= 4 && Math.abs(token.length - colorKey.length) <= 2;
}

function altMatchesColor(
  alt: string,
  colorName: string,
  allColorNames: string[]
) {
  const colorKey = foldKey(colorName);
  if (!colorKey) return false;
  const tokens = foldKey(alt).split(" ").filter(Boolean);
  if (!tokens.some((token) => tokenFitsColor(token, colorKey))) return false;

  for (const other of allColorNames) {
    if (other === colorName) continue;
    const otherKey = foldKey(other);
    if (!otherKey || otherKey === colorKey) continue;
    const otherHit = tokens.some((token) => tokenFitsColor(token, otherKey));
    if (otherHit && otherKey.length > colorKey.length) return false;
  }
  return true;
}

function imagesForColor(
  images: ShopifyImage[],
  colorName: string,
  allColorNames: string[]
): string[] {
  if (allColorNames.length <= 1) {
    return images.map((image) => image.url).filter(Boolean);
  }
  return images
    .filter((image) =>
      altMatchesColor(image.altText ?? "", colorName, allColorNames)
    )
    .map((image) => image.url)
    .filter(Boolean);
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
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
    /accessor|fylgi|belt|scarf|trefil|trefill|húfa|hufa|beanie|hat|pocket|cuff|bracelet|armband|axlabond|klút|klutur|sokk|sock/.test(
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

function mapProduct(
  node: ShopifyProduct,
  domain: string,
  baseline?: StockBaseline
): Product | null {
  const galleryImages = node.images?.nodes ?? [];
  const gallery = galleryImages.map((image) => image.url).filter(Boolean);
  const featured = node.featuredImage?.url ?? gallery[0];
  if (!featured) return null;

  const variants = mapVariants(node);
  const colorNames = optionValues(node, COLOR_OPTION);
  const colors: ProductColor[] = colorNames.map((name) => {
    const fromAlt = imagesForColor(galleryImages, name, colorNames);
    const fromVariant = variants.find(
      (variant) => variant.color === name && variant.image
    )?.image;
    const unique = [
      ...new Set([fromVariant, ...fromAlt].filter(Boolean)),
    ] as string[];
    const colorVariants = variants.filter((variant) => variant.color === name);
    const inStock = colorVariants.some((variant) => variant.available);
    const soldUnits = unitsSoldSinceBaseline(colorVariants, baseline);
    return {
      name,
      hex: colorHex(name),
      image: unique[0],
      images: unique.length ? unique : undefined,
      available: inStock,
      sellingFast: inStock && soldUnits >= SELLING_FAST_SOLD_UNITS,
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
    sellingFast: colors.length
      ? Boolean(colors[0]?.sellingFast)
      : available &&
        unitsSoldSinceBaseline(variants, baseline) >= SELLING_FAST_SOLD_UNITS,
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
          availableForSale: variantIsPurchasable(variant),
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

function variantIsPurchasable(variant: AdminVariant) {
  if (!variant.inventory_management) return true;
  if ((variant.inventory_policy ?? "deny").toLowerCase() === "continue") {
    return true;
  }
  return (variant.inventory_quantity ?? 0) > 0;
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

async function adminPut(url: string, body: unknown) {
  const token = await getAdminAccessToken();
  if (!token) return null;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "X-Shopify-Access-Token": token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(
      `Shopify Admin API ${res.status} PUT ${url.replace(/https?:\/\/[^/]+/, "")}`
    );
    return null;
  }
  return res;
}

const STOCK_BASELINE_NS = "tjetje";
const STOCK_BASELINE_KEY = "stock_baseline";

async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const token = await getAdminAccessToken();
  if (!token) return null;
  const res = await fetch(
    `https://${storeDomain()}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.error(`Shopify Admin GraphQL ${res.status}`);
    return null;
  }
  const json = (await res.json()) as {
    data?: T;
    errors?: { message?: string }[];
  };
  if (json.errors?.length) {
    console.error(
      `Shopify Admin GraphQL: ${json.errors.map((row) => row.message).join("; ")}`
    );
    return null;
  }
  return json.data ?? null;
}

function currentStockMap(product: AdminProduct): StockBaseline {
  const out: StockBaseline = {};
  for (const variant of product.variants ?? []) {
    if (!variant.inventory_management) continue;
    out[String(variant.id)] = variant.inventory_quantity ?? 0;
  }
  return out;
}

function parseStockBaseline(raw?: string): StockBaseline | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: StockBaseline = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value !== "number" || !Number.isFinite(value)) continue;
      out[key.replace(/^gid:\/\/shopify\/ProductVariant\//, "")] = value;
    }
    return Object.keys(out).length ? out : undefined;
  } catch {
    return undefined;
  }
}

async function fetchStockBaselines(
  ids: string[]
): Promise<Map<string, StockBaseline>> {
  const map = new Map<string, StockBaseline>();
  if (!ids.length) return map;
  const data = await adminGraphql<{
    nodes: ({ id: string; metafield?: { value?: string } | null } | null)[];
  }>(
    `query StockBaselines($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          metafield(namespace: "${STOCK_BASELINE_NS}", key: "${STOCK_BASELINE_KEY}") {
            value
          }
        }
      }
    }`,
    { ids }
  );
  for (const node of data?.nodes ?? []) {
    if (!node?.id) continue;
    const parsed = parseStockBaseline(node.metafield?.value);
    if (node.metafield?.value != null) {
      map.set(node.id, parsed ?? {});
    }
  }
  return map;
}

async function persistStockBaselines(
  writes: { ownerId: string; value: StockBaseline }[]
) {
  for (let i = 0; i < writes.length; i += 25) {
    const chunk = writes.slice(i, i + 25);
    const data = await adminGraphql<{
      metafieldsSet?: { userErrors?: { message: string }[] };
    }>(
      `mutation SetStockBaselines($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { message }
        }
      }`,
      {
        metafields: chunk.map((row) => ({
          ownerId: row.ownerId,
          namespace: STOCK_BASELINE_NS,
          key: STOCK_BASELINE_KEY,
          type: "json",
          value: JSON.stringify(row.value),
        })),
      }
    );
    const errors = data?.metafieldsSet?.userErrors;
    if (errors?.length) {
      console.error(
        `Shopify stock baseline: ${errors.map((row) => row.message).join("; ")}`
      );
    }
  }
}

async function syncStockBaselines(products: AdminProduct[]) {
  const ids = products.map((product) => `gid://shopify/Product/${product.id}`);
  const saved = await fetchStockBaselines(ids);
  const writes: { ownerId: string; value: StockBaseline }[] = [];
  const result = new Map<string, StockBaseline>();

  for (const product of products) {
    const ownerId = `gid://shopify/Product/${product.id}`;
    const { baseline, dirty } = mergeStockBaseline(
      currentStockMap(product),
      saved.get(ownerId)
    );
    result.set(ownerId, baseline);
    if (dirty) writes.push({ ownerId, value: baseline });
  }

  if (writes.length) await persistStockBaselines(writes);
  return result;
}

async function publishUnlistedProducts(products: AdminProduct[]) {
  const domain = storeDomain();
  for (const product of products) {
    if (product.published_at) continue;
    const res = await adminPut(
      `https://${domain}/admin/api/${API_VERSION}/products/${product.id}.json`,
      {
        product: {
          id: product.id,
          published: true,
          published_scope: "global",
        },
      }
    );
    if (res) product.published_at = new Date().toISOString();
  }
}

export async function publishOnlineStoreProducts(productIds: number[]) {
  const unique = [...new Set(productIds.filter((id) => Number.isFinite(id)))];
  if (!unique.length) return 0;
  const domain = storeDomain();
  let published = 0;
  for (const id of unique) {
    const res = await adminPut(
      `https://${domain}/admin/api/${API_VERSION}/products/${id}.json`,
      { product: { id, published: true, published_scope: "global" } }
    );
    if (res) published += 1;
  }
  return published;
}

export async function getCheckoutVariantStates(
  variantIds: string[]
): Promise<CheckoutVariantState[]> {
  const domain = storeDomain();
  const products = new Map<number, AdminProduct>();
  const states: CheckoutVariantState[] = [];

  for (const variantId of variantIds) {
    const id = variantNumericId(variantId);
    if (!id) continue;
    const variantRes = await adminFetch(
      `https://${domain}/admin/api/${API_VERSION}/variants/${id}.json`
    );
    if (!variantRes) continue;
    const variantJson = (await variantRes.json()) as {
      variant?: AdminVariant & { product_id?: number };
    };
    const variant = variantJson.variant;
    const productId = variant?.product_id;
    if (!variant || !productId) continue;

    let product = products.get(productId);
    if (!product) {
      const productRes = await adminFetch(
        `https://${domain}/admin/api/${API_VERSION}/products/${productId}.json`
      );
      if (!productRes) continue;
      const productJson = (await productRes.json()) as { product?: AdminProduct };
      product = productJson.product;
      if (!product) continue;
      products.set(productId, product);
    }

    states.push({
      variantId: toVariantGid(String(variant.id)),
      productId,
      handle: product.handle,
      title: product.title,
      status: product.status || "active",
      published: Boolean(product.published_at),
      purchasable: variantIsPurchasable(variant),
    });
  }

  return states;
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
    if (!res) {
      if (!collected.length) return null;
      const baselines = await syncStockBaselines(collected);
      return mapAdminList(collected, domain, baselines);
    }
    const json = (await res.json()) as { products?: AdminProduct[] };
    collected.push(...(json.products ?? []));
    url = nextLink(res.headers.get("link"));
    pages += 1;
  }

  await publishUnlistedProducts(collected);
  const baselines = await syncStockBaselines(collected);
  return mapAdminList(collected, domain, baselines);
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
  await publishUnlistedProducts([product]);
  const baselines = await syncStockBaselines([product]);
  return mapProduct(
    fromAdminProduct(product),
    domain,
    baselines.get(`gid://shopify/Product/${product.id}`)
  );
}

function mapAdminList(
  products: AdminProduct[],
  domain: string,
  baselines: Map<string, StockBaseline>
) {
  const mapped = products
    .map((product) =>
      mapProduct(
        fromAdminProduct(product),
        domain,
        baselines.get(`gid://shopify/Product/${product.id}`)
      )
    )
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
  const inStock = all.filter((product) => product.available !== false);
  const pool = inStock.length ? inStock : all;
  return uniqueByImage(shuffle(pool)).slice(0, Math.min(limit, pool.length));
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
