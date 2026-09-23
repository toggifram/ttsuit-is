import {
  findRedeemableGifts,
  giftLabel,
  issuedGiftTotal,
  reserveGiftCodes,
  type IssuedGift,
} from "@/lib/gift-card-ledger";
import { parseGiftAmount, templateForGift } from "@/lib/gift-card-pdf";
import { formatMoney, isGiftCardProduct } from "@/lib/product";
import {
  knownPercentOffer,
  percentOffAmount,
  normalizeDiscountCode,
  normalizeGiftCardCode,
} from "@/lib/offers";
import {
  getAdminAccessToken,
  getStorefrontAccessToken,
  storeDomain,
} from "@/lib/shopify-auth";
import { percentDraftDiscount } from "@/lib/shopify-discount";
import {
  getCheckoutVariantStates,
  publishOnlineStoreProducts,
  toVariantGid,
} from "@/lib/shopify";

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
  discountCode?: string;
  discountAmount?: number;
  discountLabel?: string;
  giftCardCode?: string;
  giftCardAmount?: number;
  giftCardLabel?: string;
  clothingAmount?: number;
  shipping: DeliveryOption[];
};

const CART_CORE_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
  }
  appliedGiftCards {
    lastCharacters
    amountUsed { amount currencyCode }
  }
  lines(first: 50) {
    nodes {
      quantity
      cost { totalAmount { amount } }
      merchandise {
        ... on ProductVariant {
          id
          product { handle title productType tags }
        }
      }
    }
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
  totalQuantity?: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  appliedGiftCards?: {
    lastCharacters?: string | null;
    amountUsed?: Money | null;
  }[];
  lines?: {
    nodes?: {
      quantity: number;
      cost?: { totalAmount?: Money | null } | null;
      merchandise?: {
        id?: string;
        product?: {
          handle?: string | null;
          title?: string | null;
          productType?: string | null;
          tags?: string[] | null;
        } | null;
      } | null;
    }[];
  };
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

function shopifyPhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 7) return `+354${digits}`;
  if (digits.length === 10 && digits.startsWith("354")) return `+${digits}`;
  if (digits.length >= 10 && raw.trim().startsWith("+")) return `+${digits}`;
  return "";
}

async function addCartDeliveryAddress(cartId: string, address: CheckoutAddress) {
  const phone = shopifyPhone(address.phone);
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
              phone: phone || undefined,
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
  for (let attempt = 0; attempt < 8; attempt++) {
    if (carrierRatesReady(last.data?.cart, attempt >= 6)) {
      return last;
    }
    await wait(600);
    last = await storefrontGraphql<{ cart?: StorefrontCart | null }>(query, {
      id: cartId,
    });
  }
  return last;
}

function optionAmount(option: { estimatedCost?: Money | null }) {
  return Number(option.estimatedCost?.amount ?? 0);
}

function carrierRatesReady(cart: StorefrontCart | null | undefined, lastChance: boolean) {
  if (!cart) return false;
  const options = deliveryNodes(cart).flatMap((group) => group.deliveryOptions ?? []);
  if (!options.length) return false;
  const dropp = options.filter((option) => /dropp/i.test(option.title ?? ""));
  if (dropp.some((option) => optionAmount(option) > 0)) return true;
  if (dropp.length && !lastChance) return false;
  return lastChance;
}

async function cartProfileRates(cartId: string) {
  return storefrontGraphql<{ cart?: StorefrontCart | null }>(
    `query CartProfileRates($id: ID!) {
      cart(id: $id) {
        ${CART_FIELDS}
      }
    }`,
    { id: cartId }
  );
}

function cleanShippingCopy(text: string) {
  return text
    .replace(/🌱\s*/g, "")
    .replace(/Sent með rafmagnsbíl/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();
}

function deliveryNodes(cart: StorefrontCart) {
  if (cart.deliveryGroups?.nodes?.length) return cart.deliveryGroups.nodes;
  return cart.deliveryGroups?.edges?.map((edge) => edge.node) ?? [];
}

function mapCart(cart: StorefrontCart): CartQuote {
  const shipping: DeliveryOption[] = [];
  const seen = new Set<string>();
  for (const group of deliveryNodes(cart)) {
    for (const option of group.deliveryOptions ?? []) {
      if (!option.handle || seen.has(option.handle)) continue;
      const amount = Number(option.estimatedCost?.amount ?? 0);
      if (!Number.isFinite(amount)) continue;
      seen.add(option.handle);
      shipping.push({
        groupId: group.id,
        handle: option.handle,
        title: cleanShippingCopy(option.title),
        description: cleanShippingCopy(option.description?.trim() || ""),
        price: formatMoney(amount, option.estimatedCost?.currencyCode ?? "ISK"),
        priceAmount: amount,
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
    clothingAmount: clothingSubtotal(cart),
    ...giftCardQuote(cart),
    shipping,
  };
}

function giftCardQuote(cart: StorefrontCart) {
  const cards = cart.appliedGiftCards ?? [];
  const amount = cards.reduce((sum, card) => {
    const used = Number(card.amountUsed?.amount ?? 0);
    return sum + (Number.isFinite(used) ? used : 0);
  }, 0);
  if (amount <= 0) return {};
  const last = cards.find((card) => card.lastCharacters)?.lastCharacters;
  return {
    giftCardAmount: amount,
    giftCardLabel: last ? `Gjafabréf ••••${last}` : "Gjafabréf",
  };
}

function clothingSubtotal(cart: StorefrontCart) {
  let clothing = 0;
  let accounted = 0;
  for (const line of cart.lines?.nodes ?? []) {
    const amount = Number(line.cost?.totalAmount?.amount ?? 0);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    accounted += amount;
    if (isGiftCardProduct(line.merchandise?.product ?? {})) continue;
    clothing += amount;
  }
  const subtotal = Number(cart.cost.subtotalAmount.amount);
  if (!accounted) return subtotal;
  return clothing;
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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type GiftVariantRow = {
  variantId: string;
  quantity: number;
  amount: number;
  title: string;
  handle: string;
  template: ReturnType<typeof templateForGift>;
};

async function giftVariantRows(lines: CheckoutLine[]): Promise<GiftVariantRow[]> {
  const ids = [...new Set(lines.map((line) => line.variantId))];
  if (!ids.length) return [];
  const queried = await adminGraphql<{
    nodes?: {
      id?: string;
      price?: string | number;
      title?: string | null;
      product?: {
        handle?: string | null;
        title?: string | null;
        productType?: string | null;
        tags?: string[] | null;
      } | null;
    }[];
  }>(
    `query GiftVariantRows($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on ProductVariant {
          id
          price
          title
          product { handle title productType tags }
        }
      }
    }`,
    { ids }
  );
  const qty = new Map<string, number>();
  for (const line of lines) {
    qty.set(line.variantId, (qty.get(line.variantId) ?? 0) + line.quantity);
  }
  const rows: GiftVariantRow[] = [];
  for (const node of queried.data?.nodes ?? []) {
    if (!node?.id || !isGiftCardProduct(node.product ?? {})) continue;
    const amount = parseGiftAmount(node.price);
    rows.push({
      variantId: node.id,
      quantity: qty.get(node.id) ?? 1,
      amount,
      title: node.product?.title || "Gjafabréf",
      handle: node.product?.handle || "",
      template: templateForGift({
        amount,
        handle: node.product?.handle,
        title: node.product?.title,
      }),
    });
  }
  return rows;
}

async function giftCardVariantIds(lines: CheckoutLine[]) {
  const rows = await giftVariantRows(lines);
  return new Set(rows.map((row) => row.variantId));
}

function cartQuantities(cart: StorefrontCart) {
  const qty = new Map<string, number>();
  for (const node of cart.lines?.nodes ?? []) {
    const id = node.merchandise?.id;
    if (!id) continue;
    qty.set(id, (qty.get(id) ?? 0) + (node.quantity || 0));
  }
  return qty;
}

function missingCheckoutLines(cart: StorefrontCart | null | undefined, lines: CheckoutLine[]) {
  if (!cart) return lines;
  const have = cartQuantities(cart);
  return lines.filter((line) => (have.get(line.variantId) ?? 0) < 1);
}

async function missingLinesError(missing: CheckoutLine[]) {
  const states = await getCheckoutVariantStates(
    missing.map((line) => line.variantId)
  );
  if (states.some((row) => !row.purchasable)) {
    return "Ein eða fleiri vörur í körfunni eru uppseldar. Taktu þær úr körfunni eða veldu aðra stærð.";
  }
  if (states.some((row) => row.status !== "active" || !row.published)) {
    return "Varan náðist ekki inn í Shopify-kassann. Hún er líklega óútgefin eða ekki sýnileg í Online Store.";
  }
  return "Varan náðist ekki inn í Shopify-kassann. Taktu hana úr körfunni og settu hana aftur inn.";
}

async function applyGiftCardToCart(cartId: string, code: string) {
  return storefrontGraphql<{
    cartGiftCardCodesUpdate?: {
      cart?: StorefrontCart | null;
      userErrors?: { message: string }[];
    };
  }>(
    `mutation ApplyGiftCard($cartId: ID!, $giftCardCodes: [String!]!) {
      cartGiftCardCodesUpdate(cartId: $cartId, giftCardCodes: $giftCardCodes) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, giftCardCodes: [code] }
  );
}

async function createQuoteCart(
  lines: CheckoutLine[],
  address: CheckoutAddress,
  discountCode?: string,
  giftCardCode?: string
) {
  const code = normalizeDiscountCode(discountCode);
  const giftCard = normalizeGiftCardCode(giftCardCode);
  return storefrontGraphql<{
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
        discountCodes: code ? [code] : undefined,
        giftCardCodes: giftCard ? [giftCard] : undefined,
        buyerIdentity: {
          email: address.email,
          phone: shopifyPhone(address.phone) || undefined,
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
                phone: shopifyPhone(address.phone) || undefined,
              },
            },
          ],
        },
      },
    }
  );
}

function applyIssuedGiftQuote(quote: CartQuote, issued: IssuedGift[]): CartQuote {
  const amount = Math.min(
    issuedGiftTotal(issued),
    Math.max(0, quote.totalAmount)
  );
  if (amount <= 0) return quote;
  const last = issued[issued.length - 1];
  return {
    ...quote,
    giftCardAmount: amount,
    giftCardLabel:
      issued.length > 1 ? `Gjafabréf × ${issued.length}` : giftLabel(last),
    totalAmount: quote.totalAmount - amount,
    total: formatMoney(quote.totalAmount - amount),
  };
}

function finalizeQuote(
  quote: CartQuote,
  discountCode?: string,
  issued: IssuedGift[] = []
) {
  return applyIssuedGiftQuote(
    applyKnownPercentOffer(quote, discountCode),
    issued
  );
}

export async function quoteShopifyCart(
  lines: CheckoutLine[],
  address: CheckoutAddress,
  discountCode?: string,
  giftCardCode?: string
): Promise<CartQuote | { error: string }> {
  const giftCard = normalizeGiftCardCode(giftCardCode);
  const issued = giftCard ? await findRedeemableGifts(giftCard) : [];
  let created = await createQuoteCart(lines, address, discountCode, giftCard);
  let cart = created.data?.cartCreate?.cart;
  if (!cart && giftCard) {
    created = await createQuoteCart(lines, address, discountCode);
    cart = created.data?.cartCreate?.cart;
  }
  const userError = created.data?.cartCreate?.userErrors?.[0]?.message;
  if (userError && !cart) return { error: userError };
  if (created.error && !cart) return { error: created.error };

  let missing = missingCheckoutLines(cart, lines);
  if (missing.length) {
    const states = await getCheckoutVariantStates(
      missing.map((line) => line.variantId)
    );
    const toPublish = [
      ...new Set(
        states
          .filter((row) => row.status === "active" && !row.published)
          .map((row) => row.productId)
      ),
    ];
    if (toPublish.length) {
      await publishOnlineStoreProducts(toPublish);
      for (let attempt = 0; attempt < 4; attempt++) {
        await wait(700);
        created = await createQuoteCart(lines, address, discountCode, giftCard);
        cart = created.data?.cartCreate?.cart;
        missing = missingCheckoutLines(cart, lines);
        if (!missing.length) break;
      }
    }
  }

  if (!cart?.checkoutUrl) {
    return {
      error:
        created.error ||
        "Gat ekki búið til körfu í Shopify. Athugaðu sendingarstillingar og að Online Store sé ekki lykilorðslæst fyrir kassa.",
    };
  }
  if (missing.length) {
    return { error: await missingLinesError(missing) };
  }

  if (giftCard && !issued.length) {
    if (!giftCardQuote(cart).giftCardAmount) {
      const applied = await applyGiftCardToCart(cart.id, giftCard);
      const applyError =
        applied.data?.cartGiftCardCodesUpdate?.userErrors?.[0]?.message ||
        applied.error;
      cart = applied.data?.cartGiftCardCodesUpdate?.cart ?? cart;
      if (applyError && !giftCardQuote(cart).giftCardAmount) {
        console.error(`Shopify gift card: ${applyError}`);
      }
    }
    if (!giftCardQuote(cart).giftCardAmount) {
      return { error: "Gjafabréfskóði fannst ekki eða er uppurinn." };
    }
  }

  const added = await addCartDeliveryAddress(cart.id, address);
  if (added.error) {
    console.error(`Shopify delivery address: ${added.error}`);
  }

  const rates = await cartWithCarrierRates(cart.id);
  if (rates.error) {
    console.error(`Shopify carrier rates: ${rates.error}`);
  }
  const fromCarrier = rates.data?.cart ? mapCart(rates.data.cart) : null;
  const profile = added.data?.cartDeliveryAddressesAdd?.cart
    ? mapCart(added.data.cartDeliveryAddressesAdd.cart)
    : null;
  const fallback = await cartProfileRates(cart.id);
  const fromProfile = fallback.data?.cart ? mapCart(fallback.data.cart) : null;
  const quoted =
    pickRichestQuote(fromCarrier, profile, fromProfile, mapCart(cart)) ??
    mapCart(cart);

  if (!quoted.shipping.length) {
    const giftIds = await giftCardVariantIds(lines);
    if (lines.length && lines.every((line) => giftIds.has(line.variantId))) {
      return finalizeQuote(
        {
          ...quoted,
          shipping: [
            {
              groupId: "digital-gift",
              handle: "digital-gift",
              title: "Rafræn sending",
              description: "PDF með kóða er sent á netfang kaupanda.",
              price: formatMoney(0, "ISK"),
              priceAmount: 0,
            },
          ],
        },
        discountCode,
        issued
      );
    }
    return {
      error:
        "Engar sendingarleiðir fundust fyrir þetta heimilisfang. Athugaðu Settings → Shipping and delivery í Shopify.",
    };
  }

  const adminRates = await fetchAdminShippingRates(
    lines,
    mailingAddress(address)
  );
  return finalizeQuote(
    mergeAdminShippingPrices(quoted, adminRates),
    discountCode,
    issued
  );
}

function applyKnownPercentOffer(quote: CartQuote, code?: string): CartQuote {
  const offer = knownPercentOffer(code);
  if (!offer) return quote;
  const base = quote.clothingAmount ?? quote.subtotalAmount;
  const already = Math.max(0, quote.subtotalAmount - quote.totalAmount);
  const want = percentOffAmount(base, offer.percent);
  if (want <= 0) {
    return {
      ...quote,
      discountCode: offer.code,
      discountAmount: 0,
      discountLabel: offer.code,
    };
  }
  const amount = already >= want * 0.9 ? already : want;
  return {
    ...quote,
    discountCode: offer.code,
    discountAmount: amount,
    discountLabel: offer.code,
    totalAmount: quote.subtotalAmount - amount,
    total: formatMoney(quote.subtotalAmount - amount),
  };
}

function pickRichestQuote(...quotes: (CartQuote | null)[]) {
  const scored = quotes.filter((quote): quote is CartQuote =>
    Boolean(quote?.shipping.length)
  );
  if (!scored.length) return null;
  return scored.sort((a, b) => {
    const droppPrice = (quote: CartQuote) =>
      quote.shipping
        .filter((row) => /dropp/i.test(row.title))
        .reduce((sum, row) => sum + row.priceAmount, 0);
    const priced = (quote: CartQuote) =>
      quote.shipping.filter((row) => row.priceAmount > 0).length;
    return (
      droppPrice(b) - droppPrice(a) ||
      priced(b) - priced(a) ||
      b.shipping.length - a.shipping.length
    );
  })[0];
}

export type PayShipping = {
  groupId: string;
  handle: string;
  title: string;
  priceAmount: number;
};

function mailingAddress(address: CheckoutAddress) {
  const phone = shopifyPhone(address.phone);
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    address1: address.address1,
    address2: address.address2 || undefined,
    city: address.city,
    zip: address.zip,
    countryCode: "IS" as const,
    phone: phone || undefined,
  };
}

async function checkoutUrlReachesShopify(url: string) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    const location = res.headers.get("location") ?? "";
    if (/\/password(\/|\?|$)/i.test(location) || /\/password(\/|\?|$)/i.test(url)) {
      return false;
    }
    if (res.status >= 300 && res.status < 400) {
      return /\/checkouts\//i.test(location) || /checkout\.shopify\.com/i.test(location);
    }
    return res.ok;
  } catch {
    return false;
  }
}

async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<{ data: T | null; error?: string }> {
  const token = await getAdminAccessToken();
  if (!token) return { data: null, error: "Shopify Admin er ekki tengt." };
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
      signal: AbortSignal.timeout(20_000),
    }
  );
  if (!res.ok) return { data: null, error: "Shopify svaraði ekki." };
  const json = (await res.json()) as GqlJson<T>;
  if (json.errors?.length) {
    return {
      data: json.data ?? null,
      error: json.errors.map((err) => err.message).filter(Boolean).join(" "),
    };
  }
  return { data: json.data ?? null };
}

type CalculatedShippingRate = {
  title: string;
  handle: string;
  price?: { amount: string; currencyCode: string } | null;
};

function shippingTitleKey(text: string) {
  return cleanShippingCopy(text)
    .replace(/\s*\(rafræn gjafabréf\)\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .toLowerCase();
}

function matchShippingRate(
  rates: CalculatedShippingRate[],
  shipping: PayShipping
) {
  const wantTitle = shippingTitleKey(shipping.title);
  const wantPrice = Math.round(shipping.priceAmount);
  if (!rates.length) return null;

  const exact = rates.find((rate) => shippingTitleKey(rate.title) === wantTitle);
  if (exact) return exact;

  const contained = rates.find((rate) => {
    const title = shippingTitleKey(rate.title);
    return Boolean(wantTitle) && (title.includes(wantTitle) || wantTitle.includes(title));
  });
  if (contained) return contained;

  const prefix = wantTitle.slice(0, 18);
  return (
    rates.find((rate) => {
      const title = shippingTitleKey(rate.title);
      const price = Math.round(Number(rate.price?.amount ?? 0));
      return price === wantPrice && prefix.length > 4 && title.startsWith(prefix);
    }) ?? null
  );
}

async function fetchAdminShippingRates(
  lines: CheckoutLine[],
  address: ReturnType<typeof mailingAddress>
) {
  const input = {
    lineItems: lines.map((line) => ({
      variantId: line.variantId,
      quantity: line.quantity,
    })),
    shippingAddress: address,
  };

  let rates: CalculatedShippingRate[] = [];
  for (let attempt = 0; attempt < 5; attempt++) {
    const calculated = await adminGraphql<{
      draftOrderCalculate?: {
        calculatedDraftOrder?: {
          availableShippingRates?: CalculatedShippingRate[] | null;
        } | null;
        userErrors?: { message: string }[];
      };
    }>(
      `mutation QuoteDraftRates($input: DraftOrderInput!) {
        draftOrderCalculate(input: $input) {
          calculatedDraftOrder {
            availableShippingRates { title handle price { amount currencyCode } }
          }
          userErrors { message }
        }
      }`,
      { input }
    );
    rates =
      calculated.data?.draftOrderCalculate?.calculatedDraftOrder
        ?.availableShippingRates ?? [];
    const pricedDropp = rates.some(
      (rate) => /dropp/i.test(rate.title) && Number(rate.price?.amount ?? 0) > 0
    );
    if (pricedDropp) return rates;
    if (rates.length && attempt >= 2 && !rates.some((rate) => /dropp/i.test(rate.title))) {
      return rates;
    }
    await wait(700);
  }
  return rates;
}

function mergeAdminShippingPrices(
  quote: CartQuote,
  rates: CalculatedShippingRate[]
): CartQuote {
  if (!rates.length) return quote;

  const shipping = quote.shipping.map((option) => {
    const match = matchShippingRate(rates, {
      groupId: option.groupId,
      handle: option.handle,
      title: option.title,
      priceAmount: option.priceAmount,
    });
    const amount = Number(match?.price?.amount ?? option.priceAmount);
    if (!match || !Number.isFinite(amount) || amount === option.priceAmount) {
      return option;
    }
    return {
      ...option,
      handle: match.handle || option.handle,
      title: cleanShippingCopy(match.title || option.title),
      priceAmount: amount,
      price: formatMoney(amount, "ISK"),
    };
  });

  const droppStillFree = shipping.some(
    (row) => /dropp/i.test(row.title) && row.priceAmount === 0
  );
  const adminDropp = rates
    .filter((rate) => /dropp/i.test(rate.title) && Number(rate.price?.amount ?? 0) > 0)
    .map((rate) => {
      const amount = Number(rate.price?.amount ?? 0);
      return {
        groupId: shipping[0]?.groupId ?? "",
        handle: rate.handle,
        title: cleanShippingCopy(rate.title),
        description:
          shipping.find((row) => /dropp/i.test(row.title))?.description ?? "",
        price: formatMoney(amount, "ISK"),
        priceAmount: amount,
      };
    });

  if ((droppStillFree || !shipping.some((row) => /dropp/i.test(row.title))) && adminDropp.length) {
    return {
      ...quote,
      shipping: [
        ...shipping.filter((row) => !/dropp/i.test(row.title)),
        ...adminDropp,
      ],
    };
  }

  return { ...quote, shipping };
}

async function shopifyShippingLine(
  lines: CheckoutLine[],
  address: ReturnType<typeof mailingAddress>,
  shipping: PayShipping
) {
  const rates = await fetchAdminShippingRates(lines, address);
  const match = matchShippingRate(rates, shipping);
  if (!match?.handle) return undefined;
  return {
    shippingRateHandle: match.handle,
    title: match.title,
  };
}

async function createTeyaCheckoutInvoice(input: {
  lines: CheckoutLine[];
  address: CheckoutAddress;
  shipping?: PayShipping;
  discountCode?: string;
  issuedGifts?: IssuedGift[];
}): Promise<{ url: string } | { error: string }> {
  const address = mailingAddress(input.address);
  const shippingLine = input.shipping
    ? await shopifyShippingLine(input.lines, address, input.shipping)
    : undefined;
  const code = normalizeDiscountCode(input.discountCode);
  const offer = knownPercentOffer(code);
  const giftRows = await giftVariantRows(input.lines);
  const giftIds = new Set(giftRows.map((row) => row.variantId));
  const shippingNote = input.shipping
    ? `Sending valin á ttsuit.is: ${input.shipping.title} (${input.shipping.priceAmount} kr.)`
    : "";
  const giftDiscount = input.issuedGifts?.length
    ? {
        title: "Gjafabréf",
        description: input.issuedGifts.map((row) => row.code).join(", "),
        value: issuedGiftTotal(input.issuedGifts),
        valueType: "FIXED_AMOUNT" as const,
      }
    : undefined;
  const draftInput = {
    email: input.address.email,
    phone: address.phone,
    note: ["Pöntun af ttsuit.is", shippingNote].filter(Boolean).join("\n"),
    tags: ["ttsuit.is", "teya", giftRows.length ? "ttsuit-gjof" : ""].filter(
      Boolean
    ),
    sourceName: "ttsuit.is",
    visibleToCustomer: true,
    allowDiscountCodesInCheckout: false,
    discountCodes: offer || !code ? undefined : [code],
    appliedDiscount: giftDiscount,
    lineItems: input.lines.map((line) => {
      const gift = giftRows.find((row) => row.variantId === line.variantId);
      if (gift) {
        return {
          title: gift.title,
          originalUnitPrice: gift.amount.toFixed(2),
          quantity: line.quantity,
          requiresShipping: false,
          sku: `TT-GIFT-${gift.template.toUpperCase()}`,
          customAttributes: [
            { key: "_tt_gift", value: gift.template },
            { key: "_tt_gift_amount", value: String(gift.amount) },
            { key: "_tt_gift_handle", value: gift.handle },
          ],
        };
      }
      return {
        variantId: line.variantId,
        quantity: line.quantity,
        appliedDiscount:
          offer && !giftIds.has(line.variantId)
            ? percentDraftDiscount(offer.code, offer.percent)
            : undefined,
      };
    }),
    shippingAddress: address,
    billingAddress: address,
    shippingLine,
  };

  const created = await adminGraphql<{
    draftOrderCreate?: {
      draftOrder?: { id?: string; invoiceUrl?: string | null } | null;
      userErrors?: { field?: string[]; message: string }[];
    };
  }>(
    `mutation CreatePayDraft($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder { id invoiceUrl }
        userErrors { field message }
      }
    }`,
    { input: draftInput }
  );

  let payload = created.data?.draftOrderCreate;
  const phoneError = payload?.userErrors?.some((err) =>
    /phone/i.test(`${err.field?.join(" ") ?? ""} ${err.message}`)
  );
  if (phoneError) {
    const retry = await adminGraphql<{
      draftOrderCreate?: {
        draftOrder?: { id?: string; invoiceUrl?: string | null } | null;
        userErrors?: { field?: string[]; message: string }[];
      };
    }>(
      `mutation CreatePayDraft($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder { id invoiceUrl }
          userErrors { field message }
        }
      }`,
      {
        input: {
          ...draftInput,
          phone: undefined,
          shippingAddress: { ...address, phone: undefined },
          billingAddress: { ...address, phone: undefined },
        },
      }
    );
    payload = retry.data?.draftOrderCreate ?? payload;
  }

  const userError = payload?.userErrors?.[0]?.message;
  if (userError) return { error: userError };
  const url = payload?.draftOrder?.invoiceUrl;
  const draftId = payload?.draftOrder?.id;
  if (!url) {
    return {
      error:
        created.error ||
        "Gat ekki opnað Teya-greiðslu. Reyndu aftur eða sendu línu á ttsuit@ttsuit.is.",
    };
  }
  if (input.issuedGifts?.length && draftId) {
    await reserveGiftCodes(
      input.issuedGifts.map((row) => row.code),
      draftId
    );
  }
  return { url };
}

function cartCheckoutUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes("/cart/c/")) {
      parsed.pathname = parsed.pathname.replace("/cart/c/", "/checkouts/cn/");
      return parsed.toString();
    }
  } catch {
    // Keep the original permalink.
  }
  return url;
}

export async function payShopifyCart(input: {
  cartId: string;
  shipping?: PayShipping;
  lines?: CheckoutLine[];
  address?: CheckoutAddress;
  discountCode?: string;
  giftCardCode?: string;
}): Promise<{ url: string } | { error: string }> {
  // /cart/c/ permalinks still hit Online Store password in a real browser.
  // Draft invoices with a shipping line lock the address and show Shopify's
  // "pre-arranged shipping" banners. Invoice without a shipping line opens
  // /checkouts/do/… (works with password) and lets the customer keep/adjust
  // the address without those warnings.
  const giftCard = normalizeGiftCardCode(input.giftCardCode);
  const issued = giftCard ? await findRedeemableGifts(giftCard) : [];
  const buyingGift = input.lines?.length
    ? (await giftVariantRows(input.lines)).length > 0
    : false;

  if (issued.length) {
    if (!input.lines?.length || !input.address) {
      return { error: "Karfan fannst ekki." };
    }
    return createTeyaCheckoutInvoice({
      lines: input.lines,
      address: input.address,
      shipping: input.shipping,
      discountCode: input.discountCode,
      issuedGifts: issued,
    });
  }

  if (giftCard) {
    const applied = await applyGiftCardToCart(input.cartId, giftCard);
    const cart = applied.data?.cartGiftCardCodesUpdate?.cart;
    if (!cart || !giftCardQuote(cart).giftCardAmount) {
      return { error: "Gjafabréfskóði fannst ekki eða er uppurinn." };
    }
  }
  // Native Shopify gift cards live on the Storefront cart. A new draft
  // invoice would drop them. Issued PDF codes use the draft path above.
  if (!giftCard && input.lines?.length && input.address) {
    const invoice = await createTeyaCheckoutInvoice({
      lines: input.lines,
      address: input.address,
      shipping: input.shipping,
      discountCode: input.discountCode,
    });
    if (!("error" in invoice)) return invoice;
    if (buyingGift) return invoice;
    console.error(`Teya invoice: ${invoice.error}`);
  }

  let cartUrl = "";
  if (input.shipping?.groupId && input.shipping.handle) {
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
        cartId: input.cartId,
        selectedDeliveryOptions: [
          {
            deliveryGroupId: input.shipping.groupId,
            deliveryOptionHandle: input.shipping.handle,
          },
        ],
      }
    );
    const userError =
      selected.data?.cartSelectedDeliveryOptionsUpdate?.userErrors?.[0]
        ?.message;
    if (userError) return { error: userError };
    cartUrl =
      selected.data?.cartSelectedDeliveryOptionsUpdate?.cart?.checkoutUrl ?? "";
  }

  if (!cartUrl) {
    const queried = await storefrontGraphql<{ cart?: StorefrontCart | null }>(
      `query CartPay($id: ID!) { cart(id: $id) { ${CART_FIELDS} } }`,
      { id: input.cartId }
    );
    cartUrl = queried.data?.cart?.checkoutUrl ?? "";
  }

  if (cartUrl) {
    const checkout = cartCheckoutUrl(cartUrl);
    if (await checkoutUrlReachesShopify(checkout)) return { url: checkout };
    if (await checkoutUrlReachesShopify(cartUrl)) return { url: cartUrl };
  }

  return {
    error:
      "Gat ekki opnað Teya-greiðslu. Reyndu aftur eða sendu línu á ttsuit@ttsuit.is.",
  };
}
