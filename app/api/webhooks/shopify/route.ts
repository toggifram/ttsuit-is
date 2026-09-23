import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import {
  fulfillPaidGiftDraft,
  fulfillShopifyIssuedGiftCard,
  type PaidDraft,
  type ShopifyGiftCardWebhook,
} from "@/lib/gift-card-fulfill";
import { storeDomain } from "@/lib/shopify-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function webhookSecret() {
  return (
    process.env.SHOPIFY_WEBHOOK_SECRET?.trim() ||
    process.env.SHOPIFY_CLIENT_SECRET?.trim() ||
    ""
  );
}

function validHmac(raw: string, header: string | null) {
  const secret = webhookSecret();
  if (!secret || !header) return false;
  const digest = createHmac("sha256", secret).update(raw, "utf8").digest("base64");
  const left = Buffer.from(digest);
  const right = Buffer.from(header);
  return left.length === right.length && timingSafeEqual(left, right);
}

function allowedShop(header: string | null) {
  const expected = storeDomain().toLowerCase();
  const got = (header || "").toLowerCase().replace(/^https?:\/\//, "");
  return !got || got === expected;
}

function unwrapPayload<T extends object>(payload: unknown, key: string): T {
  if (!payload || typeof payload !== "object") return payload as T;
  const nested = (payload as Record<string, unknown>)[key];
  if (nested && typeof nested === "object") return nested as T;
  return payload as T;
}

export async function POST(request: Request) {
  const raw = await request.text();
  const hmac = request.headers.get("x-shopify-hmac-sha256");
  if (!validHmac(raw, hmac)) {
    return NextResponse.json({ error: "Ógild undirskrift." }, { status: 401 });
  }
  if (!allowedShop(request.headers.get("x-shopify-shop-domain"))) {
    return NextResponse.json({ error: "Ógild verslun." }, { status: 401 });
  }

  const topic = (request.headers.get("x-shopify-topic") || "").toLowerCase();
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }

  try {
    if (topic === "gift_cards/create") {
      const result = await fulfillShopifyIssuedGiftCard(
        unwrapPayload<ShopifyGiftCardWebhook>(payload, "gift_card")
      );
      return NextResponse.json({ ok: true, ...result });
    }
    if (topic === "draft_orders/update" || topic === "draft_orders/create") {
      const result = await fulfillPaidGiftDraft(
        unwrapPayload<PaidDraft>(payload, "draft_order")
      );
      return NextResponse.json({ ok: true, ...result });
    }
    return NextResponse.json({ ok: true, ignored: topic });
  } catch (error) {
    console.error(
      `Gift webhook: ${error instanceof Error ? error.message : error}`
    );
    return NextResponse.json({ error: "Gjafabréf tókst ekki." }, { status: 500 });
  }
}
