import {
  formatMoney,
  shuffle,
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

const PRODUCTS_QUERY = /* GraphQL */ `
  query HomeProducts {
    products(first: 50, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        title
        handle
        productType
        tags
        onlineStoreUrl
        featuredImage {
          url(transform: { maxWidth: 900 })
          altText
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
      }
    }
  }
`;

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  productType: string | null;
  tags: string[];
  onlineStoreUrl: string | null;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  options: { name: string; values: string[] }[];
};

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

function mapProduct(node: ShopifyProduct, domain: string): Product | null {
  if (!node.featuredImage?.url) return null;
  const colorOption = node.options.find((o) =>
    /color|colour|litur/i.test(o.name)
  );
  const colors: ProductColor[] = (colorOption?.values ?? []).slice(0, 6).map((name) => ({
    name,
    hex: colorHex(name),
  }));
  const href =
    node.onlineStoreUrl ||
    `https://${domain.replace(/^https?:\/\//, "")}/products/${node.handle}`;

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    subtitle: node.productType?.trim() || "Ready to wear",
    href,
    image: node.featuredImage.url,
    imageAlt: node.featuredImage.altText || node.title,
    price: formatMoney(
      node.priceRange.minVariantPrice.amount,
      node.priceRange.minVariantPrice.currencyCode
    ),
    badge: badgeFromTags(node.tags),
    colors,
    category: categoryFrom(node),
  };
}

export async function fetchShopifyProducts(): Promise<Product[] | null> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const domain = (process.env.SHOPIFY_STORE_DOMAIN || "tje-tje.myshopify.com")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  if (!token) return null;

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query: PRODUCTS_QUERY }),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    data?: { products?: { nodes: ShopifyProduct[] } };
    errors?: unknown;
  };
  if (!json.data?.products?.nodes?.length) return null;

  return json.data.products.nodes
    .map((node) => mapProduct(node, domain))
    .filter((item): item is Product => item !== null);
}

/** Random products from every Shopify category, with a local fallback. */
export async function getHomeProducts(limit = 18): Promise<Product[]> {
  const { getCatalogProducts } = await import("./catalog");
  const all = await getCatalogProducts();
  return shuffle(all).slice(0, Math.min(limit, all.length));
}
