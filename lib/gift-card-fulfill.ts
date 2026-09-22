import { uploadGiftPdf } from "@/lib/gift-card-files";
import { sendGiftCardEmail, type GiftPdfMail } from "@/lib/gift-card-email";
import {
  issueGiftCode,
  markReservedGiftsUsed,
  purchaseAlreadyIssued,
  setGiftPdfUrl,
} from "@/lib/gift-card-ledger";
import {
  parseGiftAmount,
  stampGiftCardPdf,
  templateForGift,
  type GiftTemplateId,
} from "@/lib/gift-card-pdf";

type DraftProperty = { name?: string; value?: string };

type DraftLine = {
  title?: string;
  sku?: string;
  price?: string | number;
  quantity?: number;
  gift_card?: boolean;
  properties?: DraftProperty[];
};

export type PaidDraft = {
  id?: number | string;
  status?: string;
  email?: string | null;
  tags?: string | null;
  order_id?: number | string | null;
  line_items?: DraftLine[];
  note?: string | null;
};

function draftGid(id: number | string) {
  const raw = String(id);
  if (raw.startsWith("gid://")) return raw;
  return `gid://shopify/DraftOrder/${raw}`;
}

function propertyMap(line: DraftLine) {
  const out = new Map<string, string>();
  for (const prop of line.properties ?? []) {
    if (prop.name) out.set(prop.name, String(prop.value ?? ""));
  }
  return out;
}

function giftLines(draft: PaidDraft) {
  const out: { amount: number; template: GiftTemplateId; quantity: number }[] =
    [];
  for (const line of draft.line_items ?? []) {
    const props = propertyMap(line);
    const marker = props.get("_tt_gift");
    if (!marker && !/^TT-GIFT-/i.test(line.sku || "")) continue;
    const amount = parseGiftAmount(props.get("_tt_gift_amount") || line.price);
    const template = templateForGift({
      amount,
      handle: props.get("_tt_gift_handle"),
      title: line.title,
      sku: line.sku,
    });
    const quantity = Math.min(20, Math.max(1, Number(line.quantity) || 1));
    out.push({ amount, template, quantity });
  }
  return out;
}

export function shouldFulfillGiftDraft(draft: PaidDraft) {
  if ((draft.status || "").toLowerCase() !== "completed") return false;
  const tags = String(draft.tags || "");
  if (!/ttsuit/i.test(tags) && !/Pöntun af ttsuit\.is/i.test(draft.note || "")) {
    return false;
  }
  return true;
}

export async function fulfillPaidGiftDraft(draft: PaidDraft) {
  if (!shouldFulfillGiftDraft(draft) || draft.id == null) {
    return { skipped: true as const };
  }

  const draftId = draftGid(draft.id);
  const orderId = draft.order_id ? String(draft.order_id) : undefined;
  if (await purchaseAlreadyIssued(draftId)) {
    return { skipped: true as const, reason: "already_issued" };
  }
  await markReservedGiftsUsed(draftId, orderId);

  const lines = giftLines(draft);
  if (!lines.length) return { skipped: true as const, reason: "no_gift_lines" };

  const email = draft.email?.trim() || "";
  const cards: GiftPdfMail[] = [];

  for (const line of lines) {
    for (let i = 0; i < line.quantity; i += 1) {
      const issued = await issueGiftCode({
        amount: line.amount,
        template: line.template,
        email,
        draftId,
        orderId,
      });
      const pdf = await stampGiftCardPdf({
        template: line.template,
        code: issued.code,
      });
      const filename = `tt-gjafabref-${line.template}-${issued.code.toLowerCase()}.pdf`;
      const pdfUrl = await uploadGiftPdf(pdf, filename);
      await setGiftPdfUrl(issued.code, pdfUrl);
      cards.push({
        code: issued.code,
        amount: line.amount,
        template: line.template,
        pdfUrl,
      });
    }
  }

  if (email) {
    try {
      await sendGiftCardEmail(email, cards);
    } catch (error) {
      console.error(`Gift PDF email: ${error instanceof Error ? error.message : error}`);
    }
  }

  return { issued: cards };
}
