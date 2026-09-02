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

const CART_FIELDS = `
  id
  checkoutUrl
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  deliveryGroups(first: 5) {
    nodes {
      id
      deliveryOptions {
        handle
        title
        description
        estimatedCost { amount currencyCode }
      }
    }
  }
`;

type Money = { amount: string; currencyCode: string };

type StorefrontCart = {
  id: string;
  checkoutUrl: string;
  cost: { subtotalAmount: Money; totalAmount: Money };
  deliveryGroups: {
    nodes: {
      id: string;
      deliveryOptions: {
        handle: string;
        title: string;
        description?: string | null;
        estimatedCost: Money;
      }[];
    }[];
  };
};

type GqlJson<T> = {
  data?: T;
  errors?: { message?: string }[];
};

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
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    }
  );
  if (!res.ok) {
    return { data: null, error: "Shopify svaraði ekki." };
  }
  const json = (await res.json()) as GqlJson<T>;
  if (json.errors?.length) {
    return {
      data: json.data ?? null,
      error: json.errors.map((err) => err.message).filter(Boolean).join(" "),
    };
  }
  return { data: json.data ?? null };
}

function mapCart(cart: StorefrontCart): CartQuote {
  const shipping: DeliveryOption[] = [];
  for (const group of cart.deliveryGroups.nodes) {
    for (const option of group.deliveryOptions) {
      shipping.push({
        groupId: group.id,
        handle: option.handle,
        title: option.title,
        description: option.description?.trim() || "",
        price: formatMoney(
          option.estimatedCost.amount,
          option.estimatedCost.currencyCode
        ),
        priceAmount: Number(option.estimatedCost.amount),
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
