import { brand } from "@/lib/site";

export type OrderEmailItem = {
  title: string;
  detail: string;
  quantity: number;
  price: string;
};

export type OrderEmailData = {
  logoUrl: string;
  shopUrl: string;
  orderNumber: string;
  items: OrderEmailItem[];
  subtotal: string;
  shippingLabel: string;
  shipping: string;
  total: string;
  addressLines: string[];
};

export const sampleOrderEmail: Omit<OrderEmailData, "logoUrl" | "shopUrl"> = {
  orderNumber: "1042",
  items: [
    {
      title: "Hálfrennd merinopeysa",
      detail: "Dökkblár · L · 1 stk.",
      quantity: 1,
      price: "24.990 kr.",
    },
    {
      title: "Navy bindi með kopardoppum",
      detail: "1 stk.",
      quantity: 1,
      price: "8.990 kr.",
    },
  ],
  subtotal: "33.980 kr.",
  shippingLabel: "Dropp",
  shipping: "990 kr.",
  total: "34.970 kr.",
  addressLines: ["Laugavegur 12", "101 Reykjavík"],
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML that can later be pasted into Shopify Notifications. Table layout, inline CSS. */
export function orderConfirmationHtml(data: OrderEmailData) {
  const items = data.items
    .map(
      (item) => `
                    <tr>
                      <td style="padding:14px 0;border-bottom:1px solid #e6e2db;font-family:Georgia,'Times New Roman',serif;color:#043034;font-size:16px;line-height:1.4;">
                        ${escapeHtml(item.title)}<br>
                        <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b6b6b;">${escapeHtml(item.detail)}</span>
                      </td>
                      <td align="right" valign="top" style="padding:14px 0;border-bottom:1px solid #e6e2db;font-family:Georgia,'Times New Roman',serif;color:#043034;font-size:16px;white-space:nowrap;">
                        ${escapeHtml(item.price)}
                      </td>
                    </tr>`
    )
    .join("");

  const address = data.addressLines.map((line) => escapeHtml(line)).join("<br>");

  return `<!DOCTYPE html>
<html lang="is">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pöntun #${escapeHtml(data.orderNumber)} er móttekin</title>
</head>
<body style="margin:0;padding:0;background:#f6f4f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f4f0;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td align="center" style="background:#043034;padding:36px 32px 32px;">
              <img src="${escapeHtml(data.logoUrl)}" width="168" alt="${escapeHtml(brand.name)}" style="display:block;border:0;width:168px;height:auto;">
              <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.55);">
                Pöntunarstaðfesting
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:40px 40px 8px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.15;font-weight:normal;color:#043034;">
                Pöntunin er móttekin.
              </h1>
              <p style="margin:18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#5c5c5c;">
                Við höfum tekið við pöntun <strong style="color:#043034;">#${escapeHtml(data.orderNumber)}</strong>.
                Við förum yfir hana og sendum þegar hún er tilbúin — venjulega 1–3 virkir dagar.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:20px 40px 8px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#04303499;">
                Pöntunin
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${items}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:8px 40px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b6b6b;">
                    Vörur
                  </td>
                  <td align="right" style="padding:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#043034;">
                    ${escapeHtml(data.subtotal)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#6b6b6b;">
                    Sending · ${escapeHtml(data.shippingLabel)}
                  </td>
                  <td align="right" style="padding:8px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#043034;">
                    ${escapeHtml(data.shipping)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#043034;">
                    Samtals
                  </td>
                  <td align="right" style="padding:16px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#043034;">
                    ${escapeHtml(data.total)}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a8a8a;">
                    Allt með VSK.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:24px 40px 12px;">
              <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#04303499;">
                Sent á
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#161616;">
                ${address}
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#ffffff;padding:32px 40px 40px;">
              <a href="${escapeHtml(data.shopUrl)}" style="display:inline-block;background:#043034;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:16px 28px;">
                Áfram í verslunina
              </a>
              <p style="margin:22px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:#6b6b6b;">
                Spurning um pöntunina? Skrifaðu á
                <a href="mailto:${escapeHtml(brand.email)}" style="color:#043034;text-decoration:underline;">${escapeHtml(brand.email)}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:28px 32px 40px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#043034;">
                ${escapeHtml(brand.name)}
              </p>
              <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a8a8a;">
                <a href="${escapeHtml(data.shopUrl)}" style="color:#8a8a8a;text-decoration:none;">${escapeHtml(brand.domain)}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const orderEmailSubject = (orderNumber: string) =>
  `Pöntun #${orderNumber} er móttekin`;
