import type { Metadata } from "next";

import {
  orderConfirmationHtml,
  orderEmailSubject,
  sampleOrderEmail,
} from "@/lib/order-email";
import { brand } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pöntunarpóstur",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function OrderEmailPreviewPage() {
  const html = orderConfirmationHtml({
    ...sampleOrderEmail,
    logoUrl: "/brand/logo.svg",
    shopUrl: "/",
  });
  const subject = orderEmailSubject(sampleOrderEmail.orderNumber);

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-[720px] px-5 py-10 md:px-8 md:py-14">
        <p className="text-[11px] tracking-[0.22em] text-forest/55 uppercase">
          Sýnishorn
        </p>
        <h1 className="mt-2 font-serif text-3xl text-forest md:text-4xl">
          Pósturinn sem kaupandi fær.
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Þetta er hönnunin — ekki sent enn. Tölur og vörur eru dæmi. Þegar þú
          ert sáttur setjum við þetta inn sem pöntunarstaðfestingu í Shopify.
        </p>

        <div className="mt-8 overflow-hidden border border-forest/10 bg-white shadow-[0_18px_50px_rgba(4,48,52,0.08)]">
          <div className="border-b border-forest/10 px-5 py-4 md:px-6">
            <p className="text-[11px] tracking-[0.16em] text-forest/45 uppercase">
              Frá
            </p>
            <p className="mt-1 text-sm text-ink">
              {brand.name}{" "}
              <span className="text-ink/45">&lt;{brand.email}&gt;</span>
            </p>
            <p className="mt-3 text-[11px] tracking-[0.16em] text-forest/45 uppercase">
              Efni
            </p>
            <p className="mt-1 font-serif text-xl text-forest">{subject}</p>
          </div>
          <iframe
            title="Sýnishorn af pöntunarpósti"
            srcDoc={html}
            className="block h-[1080px] w-full bg-[#f6f4f0]"
          />
        </div>
      </div>
    </div>
  );
}
