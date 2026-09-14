import { getAdminAccessToken, storeDomain } from "@/lib/shopify-auth";
import { NEWSLETTER_OFFER } from "@/lib/offers";

const API_VERSION = "2025-01";

let nativeNewsletter: boolean | null = null;

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

export async function deleteDiscountByCode(code: string) {
  const existing = await adminGraphql<{
    codeDiscountNodeByCode?: { id?: string } | null;
  }>(
    `query DiscountByCode($code: String!) {
      codeDiscountNodeByCode(code: $code) { id }
    }`,
    { code }
  );
  const id = existing.data?.codeDiscountNodeByCode?.id;
  if (!id) return { deleted: false, reason: "not_found" as const };

  const deleted = await adminGraphql<{
    discountCodeDelete?: {
      deletedCodeDiscountId?: string | null;
      userErrors?: { message: string }[];
    };
  }>(
    `mutation DeleteDiscount($id: ID!) {
      discountCodeDelete(id: $id) {
        deletedCodeDiscountId
        userErrors { message }
      }
    }`,
    { id }
  );
  const err =
    deleted.data?.discountCodeDelete?.userErrors?.[0]?.message ||
    deleted.errors?.[0]?.message;
  if (err) return { deleted: false, reason: err };
  return {
    deleted: Boolean(deleted.data?.discountCodeDelete?.deletedCodeDiscountId),
    reason: "ok" as const,
  };
}

/** Creates the newsletter code in Shopify when the app has write_discounts. */
export async function ensureNewsletterDiscount() {
  if (nativeNewsletter) return true;

  const existing = await adminGraphql<{
    codeDiscountNodeByCode?: { id?: string } | null;
  }>(
    `query NewsletterDiscount($code: String!) {
      codeDiscountNodeByCode(code: $code) { id }
    }`,
    { code: NEWSLETTER_OFFER.code }
  );
  if (existing.data?.codeDiscountNodeByCode?.id) {
    nativeNewsletter = true;
    return true;
  }

  const created = await adminGraphql<{
    discountCodeBasicCreate?: {
      codeDiscountNode?: { id?: string } | null;
      userErrors?: { message: string }[];
    };
  }>(
    `mutation CreateNewsletterDiscount($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode { id }
        userErrors { field message }
      }
    }`,
    {
      basicCodeDiscount: {
        title: `${NEWSLETTER_OFFER.code} — póstlisti`,
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
    nativeNewsletter = true;
    return true;
  }
  if (err) console.error(`Newsletter Shopify discount: ${err}`);
  if (created.errors?.length) {
    console.error(
      `Newsletter Shopify discount: ${created.errors.map((item) => item.message).join("; ")}`
    );
  }
  nativeNewsletter = false;
  return false;
}

export function percentDraftDiscount(code: string, percent: number) {
  return {
    title: code,
    description: `${percent}%`,
    value: percent,
    valueType: "PERCENTAGE" as const,
  };
}

export function newsletterDraftDiscount() {
  return percentDraftDiscount(NEWSLETTER_OFFER.code, NEWSLETTER_OFFER.percent);
}
