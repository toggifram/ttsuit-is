export async function subscribeNewsletter(email: string) {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (response.ok) return;

  const payload = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;
  throw new Error(payload?.error || "Gat ekki skráð netfangið. Reyndu aftur.");
}
