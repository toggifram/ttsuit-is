import { NEWSLETTER_OFFER } from "@/lib/offers";

export async function subscribeNewsletter(email: string) {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const payload = (await response.json().catch(() => null)) as {
    error?: string;
    code?: string;
  } | null;

  if (response.ok) {
    return payload?.code || NEWSLETTER_OFFER.code;
  }

  throw new Error(payload?.error || "Gat ekki skráð netfangið. Reyndu aftur.");
}
