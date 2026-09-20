import { NextResponse } from "next/server";

import { normalizeDiscountCode, normalizeGiftCardCode } from "@/lib/offers";
import {
  parseAddress,
  parseCheckoutLines,
  payShopifyCart,
} from "@/lib/shopify-cart";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }
  const data = body as Record<string, unknown>;
  const cartId = typeof data.cartId === "string" ? data.cartId.trim() : "";
  if (!cartId.startsWith("gid://shopify/Cart/")) {
    return NextResponse.json({ error: "Karfa fannst ekki." }, { status: 400 });
  }

  const groupId =
    typeof data.groupId === "string" ? data.groupId.trim() : "";
  const handle = typeof data.handle === "string" ? data.handle.trim() : "";
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const priceAmount = Number(data.priceAmount);
  const discountCode = normalizeDiscountCode(
    typeof data.discountCode === "string" ? data.discountCode : ""
  );
  const giftCardCode = normalizeGiftCardCode(
    typeof data.giftCardCode === "string" ? data.giftCardCode : ""
  );
  const lines = parseCheckoutLines(data.lines) ?? undefined;
  const address = parseAddress(data.address) ?? undefined;

  const result = await payShopifyCart({
    cartId,
    shipping:
      groupId && handle
        ? {
            groupId,
            handle,
            title: title || "Sending",
            priceAmount: Number.isFinite(priceAmount) ? priceAmount : 0,
          }
        : undefined,
    lines,
    address,
    discountCode: discountCode || undefined,
    giftCardCode: giftCardCode || undefined,
  });
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }
  return NextResponse.json({ url: result.url });
}
