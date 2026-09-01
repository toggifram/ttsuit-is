import { NextResponse } from "next/server";

import { createShopifyCheckout, toVariantGid } from "@/lib/shopify";

export const dynamic = "force-dynamic";

type Line = { variantId: string; quantity: number };

function parseLines(body: unknown): Line[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { lines?: unknown }).lines;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) return null;

  const lines: Line[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") return null;
    const variantId = String((item as { variantId?: unknown }).variantId ?? "");
    const quantity = Number((item as { quantity?: unknown }).quantity);
    if (!variantId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return null;
    }
    if (
      !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(toVariantGid(variantId))
    ) {
      return null;
    }
    lines.push({ variantId: toVariantGid(variantId), quantity });
  }
  return lines;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }

  const lines = parseLines(body);
  if (!lines) {
    return NextResponse.json({ error: "Karfan er ógild." }, { status: 400 });
  }

  const result = await createShopifyCheckout(lines);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 503 });
  }
  return NextResponse.json({ url: result.url });
}
