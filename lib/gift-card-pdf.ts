import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export const GIFT_TEMPLATES = ["2500", "5000", "7500", "10000", "skyrta"] as const;

export type GiftTemplateId = (typeof GIFT_TEMPLATES)[number];

/** White rounded code pill on the merchant-supplied templates. PDF points, origin bottom-left. */
const CODE_PILL = { x: 139.66, y: 376.27, w: 562.46, h: 128.14 };

const BRAND_GREEN = rgb(4 / 255, 48 / 255, 52 / 255);

const AMOUNT_TEMPLATES: Record<number, GiftTemplateId> = {
  2500: "2500",
  5000: "5000",
  7500: "7500",
  10000: "10000",
  22990: "skyrta",
};

export function parseGiftAmount(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(value);
  }
  const raw = String(value ?? "").replace(/\s/g, "").replace(",", ".");
  const amount = Number(raw);
  return Number.isFinite(amount) ? Math.round(amount) : 0;
}

export function templateForGift(input: {
  amount?: number;
  handle?: string | null;
  title?: string | null;
  sku?: string | null;
}): GiftTemplateId {
  const hay = `${input.handle ?? ""} ${input.title ?? ""} ${input.sku ?? ""}`.toLowerCase();
  if (/skyrta/.test(hay)) return "skyrta";
  const exact = AMOUNT_TEMPLATES[input.amount ?? 0];
  if (exact) return exact;
  return "10000";
}

export function displayGiftCode(code: string) {
  const compact = code.replace(/[\s-]+/g, "").toUpperCase();
  if (compact.startsWith("TT") && compact.length === 14) {
    return `${compact.slice(0, 2)}-${compact.slice(2, 6)}-${compact.slice(6, 10)}-${compact.slice(10)}`;
  }
  return compact.replace(/(.{4})/g, "$1-").replace(/-$/, "");
}

function templatePath(id: GiftTemplateId) {
  return path.join(process.cwd(), "gift-cards", "templates", `${id}.pdf`);
}

export async function stampGiftCardPdf(input: {
  template: GiftTemplateId;
  code: string;
}) {
  const bytes = await readFile(templatePath(input.template));
  const doc = await PDFDocument.load(bytes);
  const page = doc.getPages()[0];
  if (!page) throw new Error("gift_template_empty");

  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const label = displayGiftCode(input.code);
  const maxWidth = CODE_PILL.w - 48;
  let size = 32;
  while (size > 16 && font.widthOfTextAtSize(label, size) > maxWidth) {
    size -= 1;
  }

  const tracking = 1.15;
  const trackedWidth =
    font.widthOfTextAtSize(label, size) + tracking * Math.max(0, label.length - 1);
  let cursor = CODE_PILL.x + (CODE_PILL.w - trackedWidth) / 2;
  const baseline = CODE_PILL.y + (CODE_PILL.h - size) / 2 + size * 0.12;

  for (const char of label) {
    page.drawText(char, {
      x: cursor,
      y: baseline,
      size,
      font,
      color: BRAND_GREEN,
    });
    cursor += font.widthOfTextAtSize(char, size) + tracking;
  }

  return Buffer.from(await doc.save());
}
