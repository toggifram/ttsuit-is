import { getAdminAccessToken, storeDomain } from "@/lib/shopify-auth";

const API_VERSION = "2025-01";

export type PickupLabelData = {
  orderNumber: string;
  name: string;
  phone: string;
  shippingTitle: string;
  isPickup: boolean;
};

export const samplePickupLabel: PickupLabelData = {
  orderNumber: "#1042",
  name: "Jón Jónsson",
  phone: "825 0000",
  shippingTitle: "Sækja",
  isPickup: true,
};

const PICKUP_RE = /sækja|saekja|pickup|pick[\s-]?up|local[\s-]?pickup/i;

export function isPickupShipping(title: string) {
  return PICKUP_RE.test(title);
}

export function formatOrderNumber(value: string) {
  const trimmed = value.trim().replace(/^#+/, "");
  return trimmed ? `#${trimmed}` : "";
}

export function formatIsPhone(value: string) {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  const local = digits.startsWith("354") ? digits.slice(3) : digits;
  if (local.length === 7) return `${local.slice(0, 3)} ${local.slice(3)}`;
  return trimmed;
}

export function pickupSearchQuery(raw: string) {
  const number = raw.trim().replace(/^#+/, "");
  return number;
}

function displayName(
  first?: string | null,
  last?: string | null,
  fallback?: string | null
) {
  const joined = [first, last].filter(Boolean).join(" ").trim();
  return joined || fallback?.trim() || "";
}

type GqlOrder = {
  name?: string | null;
  phone?: string | null;
  shippingLine?: { title?: string | null } | null;
  shippingAddress?: {
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  } | null;
  billingAddress?: {
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  } | null;
  customer?: {
    displayName?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
  } | null;
};

function fromGqlOrder(order: GqlOrder): PickupLabelData {
  const shippingTitle = order.shippingLine?.title?.trim() || "";
  const name =
    displayName(
      order.shippingAddress?.firstName,
      order.shippingAddress?.lastName,
      order.shippingAddress?.name
    ) ||
    displayName(
      order.customer?.firstName,
      order.customer?.lastName,
      order.customer?.displayName
    ) ||
    displayName(
      order.billingAddress?.firstName,
      order.billingAddress?.lastName,
      order.billingAddress?.name
    );
  const phone =
    order.shippingAddress?.phone ||
    order.phone ||
    order.customer?.phone ||
    order.billingAddress?.phone ||
    "";
  return {
    orderNumber: formatOrderNumber(order.name ?? ""),
    name,
    phone: formatIsPhone(phone),
    shippingTitle,
    isPickup: isPickupShipping(shippingTitle),
  };
}

type GqlJson<T> = {
  data?: T;
  errors?: { message?: string; extensions?: { code?: string } }[];
};

async function adminGraphql<T>(query: string, variables?: Record<string, unknown>) {
  const token = await getAdminAccessToken();
  if (!token) return { data: null as T | null, error: "missing_admin" as const };
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
  if (!res.ok) {
    return {
      data: null as T | null,
      error: res.status === 403 ? ("orders_scope" as const) : ("shopify" as const),
    };
  }
  const json = (await res.json()) as GqlJson<T>;
  const accessDenied = json.errors?.some(
    (err) =>
      err.extensions?.code === "ACCESS_DENIED" ||
      /access denied for orders/i.test(err.message ?? "")
  );
  if (accessDenied) {
    return { data: json.data ?? null, error: "orders_scope" as const };
  }
  if (json.errors?.length) {
    return { data: json.data ?? null, error: "shopify" as const };
  }
  return { data: json.data ?? null, error: null };
}

const ORDER_FIELDS = `
  name
  phone
  shippingLine { title }
  shippingAddress { name firstName lastName phone }
  billingAddress { name firstName lastName phone }
  customer { displayName firstName lastName phone }
`;

export type PickupLookupResult =
  | { ok: true; order: PickupLabelData }
  | { ok: false; error: "not_found" | "orders_scope" | "missing_admin" | "shopify" };

export async function lookupPickupOrder(
  rawQuery: string
): Promise<PickupLookupResult> {
  const number = pickupSearchQuery(rawQuery);
  if (!number) return { ok: false, error: "not_found" };

  const queries = [`name:#${number}`, `name:${number}`];
  for (const query of queries) {
    const { data, error } = await adminGraphql<{
      orders?: { nodes?: GqlOrder[] };
    }>(
      `query PickupOrder($query: String!) {
        orders(first: 5, query: $query, sortKey: CREATED_AT, reverse: true) {
          nodes { ${ORDER_FIELDS} }
        }
      }`,
      { query }
    );
    if (error === "orders_scope" || error === "missing_admin") {
      return { ok: false, error };
    }
    const match = data?.orders?.nodes?.find(
      (node) => pickupSearchQuery(node.name ?? "") === number
    );
    if (match) return { ok: true, order: fromGqlOrder(match) };
    if (error) return { ok: false, error };
  }

  return { ok: false, error: "not_found" };
}

export type PickupListResult =
  | { ok: true; orders: PickupLabelData[] }
  | { ok: false; error: "orders_scope" | "missing_admin" | "shopify" };

export async function listRecentPickupOrders(
  limit = 12
): Promise<PickupListResult> {
  const { data, error } = await adminGraphql<{
    orders?: { nodes?: GqlOrder[] };
  }>(
    `query RecentOrders {
      orders(first: 40, sortKey: CREATED_AT, reverse: true) {
        nodes { ${ORDER_FIELDS} }
      }
    }`
  );
  if (error === "orders_scope" || error === "missing_admin" || error === "shopify") {
    return { ok: false, error };
  }
  const orders = (data?.orders?.nodes ?? [])
    .map(fromGqlOrder)
    .filter((order) => order.isPickup)
    .slice(0, limit);
  return { ok: true, orders };
}

export function pickupLookupMessage(
  error: Exclude<PickupLookupResult, { ok: true }>["error"]
) {
  switch (error) {
    case "not_found":
      return "Pöntun fannst ekki. Athugaðu númerið eða sláðu inn nafn og síma.";
    case "orders_scope":
      return "Shopify-appið má ekki lesa pantanir enn. Sláðu inn nafn og síma, eða bættu read_orders við appið TjéTjéVefur.";
    case "missing_admin":
      return "Shopify er ekki tengt. Sláðu inn nafn, síma og pöntunarnúmer.";
    default:
      return "Gat ekki sótt pöntunina. Sláðu inn nafn og síma.";
  }
}
