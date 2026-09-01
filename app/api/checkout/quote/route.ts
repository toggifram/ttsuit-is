import { NextResponse } from "next/server";

import {
  parseAddress,
  parseCheckoutLines,
  quoteShopifyCart,
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
  const lines = parseCheckoutLines(data.lines);
  const address = parseAddress(data.address);
  const discount =
    typeof data.discountCode === "string" ? data.discountCode.trim() : "";

  if (!lines) {
    return NextResponse.json({ error: "Karfan er ógild." }, { status: 400 });
  }
  if (!address) {
    return NextResponse.json(
      { error: "Settu inn netfang, nafn, heimilisfang, póstnúmer og bæ." },
      { status: 400 }
    );
  }

  const result = await quoteShopifyCart(lines, address, discount || undefined);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }
  return NextResponse.json(result);
}
