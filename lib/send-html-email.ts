import { brand } from "@/lib/site";

function mailchimpConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  if (!apiKey) return null;
  const dc = apiKey.split("-").pop();
  if (!dc) return null;
  return { apiKey, dc, listId: process.env.MAILCHIMP_AUDIENCE_ID?.trim() };
}

export async function sendHtmlEmail(input: {
  to: string[];
  subject: string;
  html: string;
  fromName?: string;
}) {
  const cfg = mailchimpConfig();
  if (!cfg?.listId) throw new Error("missing_config");

  const recipients = [...new Set(input.to.map((row) => row.trim()).filter((row) => row.includes("@")))];
  if (!recipients.length) throw new Error("missing_recipient");

  const headers = {
    Authorization: `Bearer ${cfg.apiKey}`,
    "Content-Type": "application/json",
  };
  const base = `https://${cfg.dc}.api.mailchimp.com/3.0/campaigns`;

  const created = await fetch(base, {
    method: "POST",
    headers,
    body: JSON.stringify({
      type: "regular",
      recipients: { list_id: cfg.listId },
      settings: {
        subject_line: input.subject,
        title: `web-mail-${Date.now()}`,
        from_name: input.fromName || `${brand.name} vefur`,
        reply_to: brand.email,
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
      body: JSON.stringify({ html: input.html }),
    });
    if (!content.ok) throw new Error("mailchimp_error");

    const test = await fetch(`${base}/${campaign.id}/actions/test`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        test_emails: recipients.slice(0, 5),
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
