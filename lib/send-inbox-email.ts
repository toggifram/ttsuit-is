import { sendHtmlEmail } from "@/lib/send-html-email";
import { brand } from "@/lib/site";

export type InquiryKind = "contact" | "booking";

export type InquiryPayload = {
  kind: InquiryKind;
  name: string;
  email: string;
  phone?: string;
  when?: string;
  message: string;
};

function inquirySubject(payload: InquiryPayload) {
  const prefix =
    payload.kind === "booking" ? "Bókun mælingar" : "Hafa samband";
  return `${prefix} — ${payload.name}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function inquiryHtml(payload: InquiryPayload) {
  const rows: [string, string][] = [
    ["Tegund", payload.kind === "booking" ? "Bókun mælingar" : "Hafa samband"],
    ["Nafn", payload.name],
    ["Netfang", payload.email],
    ["Sími", payload.phone || "—"],
  ];
  if (payload.kind === "booking") {
    rows.push(["Æskilegur tími", payload.when || "—"]);
  }
  rows.push(["Skilaboð", payload.message]);

  const body = rows
    .map(
      ([label, value]) =>
        `<p style="margin:0 0 12px;font-size:16px;line-height:1.45"><strong>${escapeHtml(label)}:</strong><br>${escapeHtml(value).replaceAll("\n", "<br>")}</p>`
    )
    .join("");

  return `<div style="font-family:Georgia,serif;color:#043034;max-width:560px">${body}<p style="margin-top:24px;font-size:13px;color:#666">Sent af vefnum. Gesturinn fer ekki á póstlistann.</p></div>`;
}

export async function sendInquiryToInbox(payload: InquiryPayload) {
  await sendHtmlEmail({
    to: [brand.email],
    subject: inquirySubject(payload),
    html: inquiryHtml(payload),
  });
}
