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

function mailchimpConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  if (!apiKey) return null;
  const dc = apiKey.split("-").pop();
  if (!dc) return null;
  return { apiKey, dc, listId: process.env.MAILCHIMP_AUDIENCE_ID?.trim() };
}

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
  const cfg = mailchimpConfig();
  if (!cfg?.listId) throw new Error("missing_config");

  const headers = {
    Authorization: `Bearer ${cfg.apiKey}`,
    "Content-Type": "application/json",
  };
  const base = `https://${cfg.dc}.api.mailchimp.com/3.0/campaigns`;
  const to = brand.email;
  const subject = inquirySubject(payload);

  const created = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "regular",
      recipients: { list_id: cfg.listId },
      settings: {
        subject_line: subject,
        title: `web-inquiry-${Date.now()}`,
        from_name: "Tjé Tjé vefur",
        reply_to: to,
      },
    }),
  });
  const campaign = (await created.json()) as { id?: string; detail?: string };
  if (!created.ok || !campaign.id) {
    throw new Error(campaign.detail || "mailchimp_error");
  }

  try {
    const content = await fetch(`${base}/${campaign.id}/content`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ html: inquiryHtml(payload) }),
    });
    if (!content.ok) throw new Error("mailchimp_error");

    const test = await fetch(`${base}/${campaign.id}/actions/test`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        test_emails: [to],
        send_type: "html",
      }),
    });
    if (!test.ok) {
      const err = (await test.json().catch(() => null)) as {
        detail?: string;
      } | null;
      throw new Error(err?.detail || "mailchimp_error");
    }
  } finally {
    await fetch(`${base}/${campaign.id}`, { method: "DELETE", headers });
  }
}
