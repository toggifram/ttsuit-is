import { formatMoney } from "@/lib/product";
import { getStorefrontAccessToken, storeDomain } from "@/lib/shopify-auth";
import { toVariantGid } from "@/lib/shopify";

const API_VERSION = "2025-01";

export type CheckoutLine = { variantId: string; quantity: number };

export type CheckoutAddress = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
};

export type DeliveryOption = {
  groupId: string;
  handle: string;
  title: string;
  description: string;
  price: string;
  priceAmount: number;
};

export type CartQuote = {
  cartId: string;
  checkoutUrl: string;
  subtotal: string;
  total: string;
  subtotalAmount: number;
  totalAmount: number;
  shipping: DeliveryOption[];
};

const CART_CORE_FIELDS = `
  id
  checkoutUrl
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
`;

const DELIVERY_GROUP_FIELDS = `
  id
  deliveryOptions {
    handle
    title
    description
    estimatedCost { amount currencyCode }
  }
`;

const CART_FIELDS = `
  ${CART_CORE_FIELDS}
  deliveryGroups(first: 10) {
    nodes { ${DELIVERY_GROUP_FIELDS} }
  }
`;

type Money = { amount: string; currencyCode: string };

type DeliveryGroup = {
  id: string;
  deliveryOptions?: {
    handle: string;
    title: string;
    description?: string | null;
    estimatedCost?: Money | null;
  }[];
};

type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  cost: { subtotalAmount: Money; totalAmount: Money };
  deliveryGroups?: {
    nodes?: DeliveryGroup[];
    edges?: { node: DeliveryGroup }[];
  };
};

type GqlJson<T> = {
  data?: T;
  errors?: { message?: string }[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepMerge(target: unknown, source: unknown): unknown {
  if (Array.isArray(source)) return source;
  if (!isRecord(source)) return source;
  const base = isRecord(target) ? { ...target } : {};
  for (const [key, value] of Object.entries(source)) {
    base[key] = key in base ? deepMerge(base[key], value) : value;
  }
  return base;
}

function mergeAtPath(
  root: Record<string, unknown>,
  path: (string | number)[],
  value: unknown
) {
  if (!path.length) {
    return deepMerge(root, value) as Record<string, unknown>;
  }
  const next = { ...root };
  let cursor: Record<string, unknown> | unknown[] = next;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const existing = Array.isArray(cursor)
      ? cursor[key as number]
      : (cursor as Record<string, unknown>)[key as string];
    const child =
      existing == null
        ? typeof path[i + 1] === "number"
          ? []
          : {}
        : Array.isArray(existing)
          ? [...existing]
          : isRecord(existing)
            ? { ...existing }
            : existing;
    if (Array.isArray(cursor)) cursor[key as number] = child;
    else (cursor as Record<string, unknown>)[key as string] = child;
    cursor = child as Record<string, unknown> | unknown[];
  }
  const last = path[path.length - 1];
  const current = Array.isArray(cursor)
    ? cursor[last as number]
    : (cursor as Record<string, unknown>)[last as string];
  const merged = deepMerge(current ?? {}, value);
  if (Array.isArray(cursor)) cursor[last as number] = merged;
  else (cursor as Record<string, unknown>)[last as string] = merged;
  return next;
}

function graphqlParts(raw: string, contentType: string) {
  if (!contentType.includes("multipart/mixed")) {
    return [raw];
  }
  const boundary =
    contentType.match(/boundary="?([^";]+)"?/i)?.[1]?.trim() ?? "graphql";
  return raw
    .split(`--${boundary}`)
    .map((chunk) => {
      const trimmed = chunk.trim();
      if (!trimmed || trimmed === "--") return "";
      const start = trimmed.indexOf("{");
      return start >= 0 ? trimmed.slice(start).replace(/--\s*$/, "").trim() : "";
    })
    .filter(Boolean);
}

function mergeGraphqlPayloads<T>(raw: string, contentType: string): GqlJson<T> {
  let data: Record<string, unknown> = {};
  const errors: { message?: string }[] = [];
  for (const part of graphqlParts(raw, contentType)) {
    let json: GqlJson<Record<string, unknown>> & {
      incremental?: {
        path?: (string | number)[];
        data?: Record<string, unknown>;
        errors?: { message?: string }[];
      }[];
    };
    try {
      json = JSON.parse(part) as typeof json;
    } catch {
      continue;
    }
    if (json.errors?.length) errors.push(...json.errors);
    if (json.data) data = deepMerge(data, json.data) as Record<string, unknown>;
    for (const increment of json.incremental ?? []) {
      if (increment.errors?.length) errors.push(...increment.errors);
      if (!increment.data) continue;
      data = mergeAtPath(data, increment.path ?? [], increment.data);
    }
  }
  return {
    data: (Object.keys(data).length ? data : undefined) as T | undefined,
    errors: errors.length ? errors : undefined,
  };
}

async function storefrontGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data: T | null; error?: string }> {
  const token = await getStorefrontAccessToken();
  if (!token) {
    return { data: null, error: "Shopify Storefront er ekki tengt." };
  }
  const res = await fetch(
    `https://${storeDomain()}/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/mixed, application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    }
  );
  if (!res.ok) {
    return { data: null, error: "Shopify svaraði ekki." };
  }
  const raw = await res.text();
  const json = mergeGraphqlPayloads<T>(
    raw,
    res.headers.get("content-type") ?? ""
  );
  if (json.errors?.length) {
    return {
      data: json.data ?? null,
      error: json.errors.map((err) => err.message).filter(Boolean).join(" "),
    };
  }
  return { data: json.data ?? null };
}

async function addCartDeliveryAddress(cartId: string, address: CheckoutAddress) {
  return storefrontGraphql<{
    cartDeliveryAddressesAdd?: {
      cart?: StorefrontCart | null;
      userErrors?: { message: string }[];
    };
  }>(
    `mutation AddCartAddress($id: ID!, $addresses: [CartSelectableAddressInput!]!) {
      cartDeliveryAddressesAdd(cartId: $id, addresses: $addresses) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    {
      id: cartId,
      addresses: [
        {
          selected: true,
          address: {
            deliveryAddress: {
              firstName: address.firstName,
              lastName: address.lastName,
              address1: address.address1,
              address2: address.address2,
              city: address.city,
              zip: address.zip,
              countryCode: "IS",
              phone: address.phone || undefined,
            },
          },
        },
      ],
    }
  );
}

async function cartWithCarrierRates(cartId: string) {
  const query = `query CartCarrierRates($id: ID!) {
      cart(id: $id) {
        ${CART_CORE_FIELDS}
        ...DeliveryGroups @defer
      }
    }
    fragment DeliveryGroups on Cart {
      deliveryGroups(first: 10, withCarrierRates: true) {
        nodes { ${DELIVERY_GROUP_FIELDS} }
      }
    }`;

  let last = await storefrontGraphql<{ cart?: StorefrontCart | null }>(query, {
    id: cartId,
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    const cart = last.data?.cart;
    if (cart && deliveryNodes(cart).some((group) => group.deliveryOptions?.length)) {
      return last;
    }
    await new Promise((resolve) => setTimeout(resolve, 700));
    last = await storefrontGraphql<{ cart?: StorefrontCart | null }>(query, {
      id: cartId,
    });
  }
  return last;
}

function deliveryNodes(cart: StorefrontCart) {
  if (cart.deliveryGroups?.nodes?.length) return cart.deliveryGroups.nodes;
  return cart.deliveryGroups?.edges?.map((edge) => edge.node) ?? [];
}

function mapCart(cart: StorefrontCart): CartQuote {
  const shipping: DeliveryOption[] = [];
  for (const group of deliveryNodes(cart)) {
    for (const option of group.deliveryOptions ?? []) {
      const cost = option.estimatedCost;
      if (!option.handle || !cost) continue;
      shipping.push({
        groupId: group.id,
        handle: option.handle,
        title: option.title,
        description: option.description?.trim() || "",
        price: formatMoney(cost.amount, cost.currencyCode),
        priceAmount: Number(cost.amount),
      });
    }
  }
  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    subtotal: formatMoney(
      cart.cost.subtotalAmount.amount,
      cart.cost.subtotalAmount.currencyCode
    ),
    total: formatMoney(
      cart.cost.totalAmount.amount,
      cart.cost.totalAmount.currencyCode
    ),
    subtotalAmount: Number(cart.cost.subtotalAmount.amount),
    totalAmount: Number(cart.cost.totalAmount.amount),
    shipping,
  };
}

export function parseCheckoutLines(raw: unknown): CheckoutLine[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;
  const lines: CheckoutLine[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const variantId = String((item as { variantId?: unknown }).variantId ?? "");
    const quantity = Number((item as { quantity?: unknown }).quantity);
    if (!variantId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return null;
    }
    const gid = toVariantGid(variantId);
    if (!/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(gid)) return null;
    lines.push({ variantId: gid, quantity });
  }
  return lines;
}

export function parseAddress(raw: unknown): CheckoutAddress | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const read = (key: string) =>
    typeof data[key] === "string" ? String(data[key]).trim() : "";
  const email = read("email");
  const firstName = read("firstName");
  const lastName = read("lastName");
  const address1 = read("address1");
  const city = read("city");
  const zip = read("zip");
  if (!email.includes("@") || firstName.length < 1 || lastName.length < 1) {
    return null;
  }
  if (address1.length < 3 || city.length < 2 || zip.length < 3) return null;
  return {
    email,
    phone: read("phone"),
    firstName,
    lastName,
    address1,
    address2: read("address2") || undefined,
    city,
    zip,
  };
}

export async function quoteShopifyCart(
  lines: CheckoutLine[],
  address: CheckoutAddress,
  discountCode?: string
): Promise<CartQuote | { error: string }> {
  const { data, error } = await storefrontGraphql<{
    cartCreate?: {
      cart?: StorefrontCart | null;
      userErrors?: { message: string }[];
    };
  }>(
    `mutation QuoteCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { message }
      }
    }`,
    {
      input: {
        lines: lines.map((line) => ({
          merchandiseId: line.variantId,
          quantity: line.quantity,
        })),
        discountCodes: discountCode ? [discountCode] : undefined,
        buyerIdentity: {
          email: address.email,
          phone: address.phone || undefined,
          countryCode: "IS",
          deliveryAddressPreferences: [
            {
              deliveryAddress: {
                firstName: address.firstName,
                lastName: address.lastName,
                address1: address.address1,
                address2: address.address2,
                city: address.city,
                zip: address.zip,
                country: "IS",
                phone: address.phone || undefined,
              },
            },
          ],
        },
      },
    }
  );

  const userError = data?.cartCreate?.userErrors?.[0]?.message;
  if (userError) return { error: userError };
  if (error && !data?.cartCreate?.cart) return { error };
  const cart = data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) {
    return {
      error:
        "Gat ekki búið til körfu í Shopify. Athugaðu sendingarstillingar og að Online Store sé ekki lykilorðslæst fyrir kassa.",
    };
  }

  const added = await addCartDeliveryAddress(cart.id, address);
  if (added.error) {
    console.error(`Shopify delivery address: ${added.error}`);
  }

  const rates = await cartWithCarrierRates(cart.id);
  if (rates.error) {
    console.error(`Shopify carrier rates: ${rates.error}`);
  }
  const rated = rates.data?.cart;
  if (rated?.id) {
    const mapped = mapCart(rated);
    if (mapped.shipping.length) return mapped;
  }
  return mapCart(cart);
}

export async function payShopifyCart(
  cartId: string,
  shipping?: { groupId: string; handle: string }
): Promise<{ url: string } | { error: string }> {
  if (shipping?.groupId && shipping.handle) {
    const selected = await storefrontGraphql<{
      cartSelectedDeliveryOptionsUpdate?: {
        cart?: StorefrontCart | null;
        userErrors?: { message: string }[];
      };
    }>(
      `mutation PickShipping($cartId: ID!, $selectedDeliveryOptions: [CartSelectedDeliveryOptionInput!]!) {
        cartSelectedDeliveryOptionsUpdate(
          cartId: $cartId
          selectedDeliveryOptions: $selectedDeliveryOptions
        ) {
          cart { ${CART_FIELDS} }
          userErrors { message }
        }
      }`,
      {
        cartId,
        selectedDeliveryOptions: [
          {
            deliveryGroupId: shipping.groupId,
            deliveryOptionHandle: shipping.handle,
          },
        ],
      }
    );
    const userError =
      selected.data?.cartSelectedDeliveryOptionsUpdate?.userErrors?.[0]
        ?.message;
    if (userError) return { error: userError };
    const url =
      selected.data?.cartSelectedDeliveryOptionsUpdate?.cart?.checkoutUrl;
    if (url) return { url };
  }

  const queried = await storefrontGraphql<{ cart?: StorefrontCart | null }>(
    `query CartPay($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
    { id: cartId }
  );
  const url = queried.data?.cart?.checkoutUrl;
  if (!url) {
    return { error: queried.error || "Gat ekki opnað greiðslu." };
  }
  return { url };
}
