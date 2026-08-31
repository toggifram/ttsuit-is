import { createHash } from "node:crypto";

function config() {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) return null;
  const dc = apiKey.split("-").pop();
  if (!dc) return null;
  return { apiKey, audienceId, dc };
}

function subscriberHash(email: string) {
  return createHash("md5").update(email.toLowerCase()).digest("hex");
}

export async function subscribeToMailchimp(email: string) {
  const cfg = config();
  if (!cfg) {
    throw new Error("missing_config");
  }

  const url = `https://${cfg.dc}.api.mailchimp.com/3.0/lists/${cfg.audienceId}/members/${subscriberHash(email)}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      status: "subscribed",
    }),
  });

  if (response.ok) return;

  const payload = (await response.json().catch(() => null)) as {
    title?: string;
    detail?: string;
  } | null;

  if (payload?.title === "Member Exists") return;

  if (
    payload?.title === "Invalid Resource" &&
    /fake or invalid|valid email/i.test(payload.detail ?? "")
  ) {
    throw new Error("invalid_email");
  }

  const error = new Error(payload?.detail || "mailchimp_error");
  error.name = "MailchimpError";
  throw error;
}
