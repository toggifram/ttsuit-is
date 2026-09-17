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
    logoUrl: "/brand/logo-email.png",
    shopUrl: "https://www.ttsuit.is/verslun",
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
          Sýnishorn með dæmistölum. Lógóið er komið á Shopify. Póstsniðmátið
          sjálft þarf að líma inn í Shopify-stjórnborðinu — forrit mega það
          ekki.
        </p>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70">
          1.{" "}
          <a
            href="https://admin.shopify.com/store/tje-tje/email_templates/order_confirmation/edit"
            className="text-forest underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Opna pöntunarstaðfestingu í Shopify
          </a>
          .<br />
          2. Veldu <span className="text-ink">Edit code</span>.<br />
          3. Límdu inn skrána{" "}
          <span className="text-ink">emails/order-confirmation.liquid</span>.
          <br />
          4. Efni pósts:{" "}
          <span className="text-ink">
            Pöntun {"{{ order_name }}"} er móttekin
          </span>
          .
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
