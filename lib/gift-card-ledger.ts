import { randomBytes } from "node:crypto";

import { getAdminAccessToken, storeDomain } from "@/lib/shopify-auth";
import {
  displayGiftCode,
  parseGiftAmount,
  type GiftTemplateId,
} from "@/lib/gift-card-pdf";
import { normalizeGiftCardCode } from "@/lib/offers";

const API_VERSION = "2025-01";
const NS = "tjetje";
const KEY = "gift_pdf_codes";
const SHOP_ID = "gid://shopify/Shop/92270821560";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export type IssuedGiftStatus = "unused" | "reserved" | "used";

export type IssuedGift = {
  code: string;
  amount: number;
  template: GiftTemplateId;
  status: IssuedGiftStatus;
  email?: string;
  draftId?: string;
  orderId?: string;
  pdfUrl?: string;
  createdAt: string;
  reservedAt?: string;
  usedAt?: string;
};

async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const token = await getAdminAccessToken();
  if (!token) return null;
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
  if (!res.ok) return null;
  const json = (await res.json()) as {
    data?: T;
    errors?: { message?: string }[];
  };
  if (json.errors?.length) {
    console.error(
      `Gift ledger GraphQL: ${json.errors.map((row) => row.message).join("; ")}`
    );
    return json.data ?? null;
  }
  return json.data ?? null;
}

function parseLedger(raw?: string | null): Record<string, IssuedGift> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, IssuedGift> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object") continue;
      const row = value as IssuedGift;
      const code = normalizeGiftCardCode(row.code || key);
      if (!code || !row.amount) continue;
      out[code] = { ...row, code };
    }
    return out;
  } catch {
    return {};
  }
}

async function readLedger() {
  const data = await adminGraphql<{
    shop?: { metafield?: { value?: string } | null };
  }>(
    `query GiftLedger {
      shop {
        metafield(namespace: "${NS}", key: "${KEY}") { value }
      }
    }`
  );
  return parseLedger(data?.shop?.metafield?.value);
}

async function writeLedger(ledger: Record<string, IssuedGift>) {
  const data = await adminGraphql<{
    metafieldsSet?: { userErrors?: { message: string }[] };
  }>(
    `mutation SetGiftLedger($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors { message }
      }
    }`,
    {
      metafields: [
        {
          ownerId: SHOP_ID,
          namespace: NS,
          key: KEY,
          type: "json",
          value: JSON.stringify(ledger),
        },
      ],
    }
  );
  const error = data?.metafieldsSet?.userErrors?.[0]?.message;
  if (error) throw new Error(error);
}

function newCode() {
  const bytes = randomBytes(12);
  let body = "";
  for (const byte of bytes) {
    body += ALPHABET[byte % ALPHABET.length];
    if (body.length === 12) break;
  }
  return `TT${body}`;
}

export async function issueGiftCode(input: {
  amount: number;
  template: GiftTemplateId;
  email?: string;
  draftId?: string;
  orderId?: string;
}) {
  const amount = parseGiftAmount(input.amount);
  if (amount <= 0) throw new Error("invalid_gift_amount");

  const ledger = await readLedger();
  let code = newCode();
  for (let i = 0; i < 8 && ledger[code]; i += 1) code = newCode();
  if (ledger[code]) throw new Error("gift_code_collision");

  const row: IssuedGift = {
    code,
    amount,
    template: input.template,
    status: "unused",
    email: input.email,
    draftId: input.draftId,
    orderId: input.orderId,
    createdAt: new Date().toISOString(),
  };
  ledger[code] = row;
  await writeLedger(ledger);
  return row;
}

export async function setGiftPdfUrl(code: string, pdfUrl: string) {
  const key = normalizeGiftCardCode(code);
  const ledger = await readLedger();
  const row = ledger[key];
  if (!row) return null;
  row.pdfUrl = pdfUrl;
  ledger[key] = row;
  await writeLedger(ledger);
  return row;
}

export async function findRedeemableGifts(raw: string) {
  const tokens = raw
    .split(/[,\s;]+/)
    .map((token) => normalizeGiftCardCode(token))
    .filter(Boolean);
  if (!tokens.length) return [];
  const ledger = await readLedger();
  const found: IssuedGift[] = [];
  for (const token of tokens) {
    const row = ledger[token];
    if (!row || row.status === "used") return [];
    if (row.status === "reserved") {
      const age = row.reservedAt ? Date.now() - Date.parse(row.reservedAt) : 0;
      if (Number.isFinite(age) && age < 2 * 60 * 60 * 1000) return [];
    }
    found.push(row);
  }
  return found;
}

export async function reserveGiftCodes(codes: string[], draftId: string) {
  const ledger = await readLedger();
  const now = new Date().toISOString();
  for (const raw of codes) {
    const key = normalizeGiftCardCode(raw);
    const row = ledger[key];
    if (!row) continue;
    row.status = "reserved";
    row.draftId = draftId;
    row.reservedAt = now;
    ledger[key] = row;
  }
  await writeLedger(ledger);
}

export async function markReservedGiftsUsed(draftId: string, orderId?: string) {
  const ledger = await readLedger();
  const now = new Date().toISOString();
  let dirty = false;
  for (const row of Object.values(ledger)) {
    if (row.draftId !== draftId || row.status !== "reserved") continue;
    row.status = "used";
    row.usedAt = now;
    if (orderId) row.orderId = orderId;
    ledger[row.code] = row;
    dirty = true;
  }
  if (dirty) await writeLedger(ledger);
}

export async function purchaseAlreadyIssued(draftId: string) {
  const ledger = await readLedger();
  return Object.values(ledger).some(
    (row) => row.draftId === draftId && row.status !== "used" && row.pdfUrl
  );
}

export function giftLabel(row: IssuedGift) {
  return `Gjafabréf ${displayGiftCode(row.code)}`;
}

export function issuedGiftTotal(rows: IssuedGift[]) {
  return rows.reduce((sum, row) => sum + row.amount, 0);
}
