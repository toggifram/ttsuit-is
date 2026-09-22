import { displayGiftCode } from "@/lib/gift-card-pdf";
import { sendHtmlEmail } from "@/lib/send-html-email";
import { brand, siteUrl } from "@/lib/site";

export type GiftPdfMail = {
  code: string;
  amount: number;
  pdfUrl: string;
  template: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatIsk(amount: number) {
  return `${new Intl.NumberFormat("is-IS").format(amount)} kr.`;
}

export function giftCardEmailHtml(cards: GiftPdfMail[]) {
  const items = cards
    .map((card) => {
      const label =
        card.template === "skyrta"
          ? "Sérsaumuð skyrta"
          : formatIsk(card.amount);
      return `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #e6e2db;">
            <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#043034;">
              ${escapeHtml(label)}
            </p>
            <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;letter-spacing:0.12em;color:#043034;">
              ${escapeHtml(displayGiftCode(card.code))}
            </p>
            <p style="margin:16px 0 0;">
              <a href="${escapeHtml(card.pdfUrl)}" style="display:inline-block;background:#043034;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;padding:14px 22px;">
                Sækja PDF
              </a>
            </p>
          </td>
        </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="is">
<head><meta charset="utf-8"><title>Gjafabréf Tjé Tjé</title></head>
<body style="margin:0;padding:0;background:#f6f4f0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f4f0;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td align="center" style="background:#043034;padding:36px 32px 28px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#ffffff;">Tjé Tjé</p>
              <p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.55);">Gjafabréf</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:36px 40px 8px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:normal;color:#043034;">
                Hér er gjafabréfið.
              </h1>
              <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#5c5c5c;">
                PDF-skjalið er tilbúið til að prenta eða senda áfram. Kóðinn gildir í vefversluninni og í sérsaum í tvö ár frá útgáfudegi.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:12px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${items}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:24px 40px 40px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#6b6b6b;">
                Viðtakandi slær kóðann inn í kassann á
                <a href="${escapeHtml(siteUrl())}/kassi" style="color:#043034;">${escapeHtml(brand.domain)}</a>.
                Hægt er að púsla saman fleiri en einu gjafabréfi.
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

export async function sendGiftCardEmail(to: string, cards: GiftPdfMail[]) {
  if (!cards.length) return;
  const recipients = [to, brand.email].filter(Boolean);
  await sendHtmlEmail({
    to: recipients,
    subject:
      cards.length > 1
        ? `Gjafabréf frá ${brand.name}`
        : `Gjafabréf frá ${brand.name} — ${
            cards[0].template === "skyrta"
              ? "sérsaumuð skyrta"
              : `${new Intl.NumberFormat("is-IS").format(cards[0].amount)} kr.`
          }`,
    html: giftCardEmailHtml(cards),
  });
}
