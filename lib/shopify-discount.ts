import { getAdminAccessToken, storeDomain } from "@/lib/shopify-auth";
import { NEWSLETTER_OFFER } from "@/lib/offers";

const API_VERSION = "2025-01";

let nativeOpen15: boolean | null = null;

type GqlJson<T> = {
  data?: T;
  errors?: { message?: string }[];
};

async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<GqlJson<T>> {
  const token = await getAdminAccessToken();
  if (!token) return { errors: [{ message: "missing_token" }] };
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
  if (!res.ok) return { errors: [{ message: `http_${res.status}` }] };
  return (await res.json()) as GqlJson<T>;
}

/** Creates Open15 in Shopify when the app has write_discounts. */
export async function ensureOpen15Discount() {
  if (nativeOpen15) return true;

  const existing = await adminGraphql<{
    codeDiscountNodeByCode?: { id?: string } | null;
  }>(
    `query Open15($code: String!) {
      codeDiscountNodeByCode(code: $code) { id }
    }`,
    { code: NEWSLETTER_OFFER.code }
  );
  if (existing.data?.codeDiscountNodeByCode?.id) {
    nativeOpen15 = true;
    return true;
  }

  const created = await adminGraphql<{
    discountCodeBasicCreate?: {
      codeDiscountNode?: { id?: string } | null;
      userErrors?: { message: string }[];
    };
  }>(
    `mutation CreateOpen15($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }`,
    {
      basicCodeDiscount: {
        title: "Open15 — póstlisti",
        code: NEWSLETTER_OFFER.code,
        startsAt: new Date().toISOString(),
        appliesOncePerCustomer: true,
        customerGets: {
          value: { percentage: NEWSLETTER_OFFER.percent / 100 },
          items: { all: true },
        },
        customerSelection: { all: true },
        combinesWith: {
          orderDiscounts: false,
          productDiscounts: false,
          shippingDiscounts: true,
        },
      },
    }
  );

  const node = created.data?.discountCodeBasicCreate?.codeDiscountNode?.id;
  const err = created.data?.discountCodeBasicCreate?.userErrors?.[0]?.message;
  if (node) {
    nativeOpen15 = true;
    return true;
  }
  if (err) console.error(`Open15 Shopify discount: ${err}`);
  if (created.errors?.length) {
    console.error(
      `Open15 Shopify discount: ${created.errors.map((item) => item.message).join("; ")}`
    );
  }
  nativeOpen15 = false;
  return false;
}

export function open15DraftDiscount() {
  return {
    title: NEWSLETTER_OFFER.code,
    description: "Póstlisti — tilbúinn fatnaður",
    value: NEWSLETTER_OFFER.percent,
    valueType: "PERCENTAGE" as const,
  };
}
