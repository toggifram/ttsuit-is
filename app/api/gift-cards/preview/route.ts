import { NextResponse } from "next/server";

import {
  GIFT_TEMPLATES,
  stampGiftCardPdf,
  type GiftTemplateId,
} from "@/lib/gift-card-pdf";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SAMPLE: Record<GiftTemplateId, string> = {
  "2500": "TTPR-UF25-00KO-DIXX",
  "5000": "TTPR-UF50-00KO-DIXX",
  "7500": "TTPR-UF75-00KO-DIXX",
  "10000": "TTPR-UF10-000K-ODIX",
  skyrta: "TTPR-UFSK-YRTA-KODI",
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Ekki í boði." }, { status: 404 });
  }
  const url = new URL(request.url);
  const raw = url.searchParams.get("sniðmat") || url.searchParams.get("template") || "2500";
  const template = GIFT_TEMPLATES.includes(raw as GiftTemplateId)
    ? (raw as GiftTemplateId)
    : "2500";
  const pdf = await stampGiftCardPdf({
    template,
    code: SAMPLE[template],
  });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="tt-gjafabref-${template}.pdf"`,
    },
  });
}
