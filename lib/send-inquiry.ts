import { brand } from "@/lib/site";

export type InquiryKind = "contact" | "booking";

export type InquiryPayload = {
  kind: InquiryKind;
  name: string;
  email: string;
  phone?: string;
  when?: string;
  message: string;
  company?: string;
};

export function inquirySubject(payload: InquiryPayload) {
  const prefix =
    payload.kind === "booking" ? "Bókun mælingar" : "Hafa samband";
  return `${prefix} — ${payload.name}`;
}

export function inquiryText(payload: InquiryPayload) {
  const lines = [
    payload.kind === "booking" ? "Ný bókun af vefnum." : "Ný fyrirspurn af vefnum.",
    "",
    `Nafn: ${payload.name}`,
    `Netfang: ${payload.email}`,
    `Sími: ${payload.phone || "—"}`,
  ];
  if (payload.kind === "booking") {
    lines.push(`Æskilegur tími: ${payload.when || "—"}`);
  }
  lines.push("", "Skilaboð:", payload.message);
  return lines.join("\n");
}

export async function submitInquiry(payload: InquiryPayload) {
  const response = await fetch("/api/inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error || "Gat ekki sent skilaboðin. Reyndu aftur.");
  }

  await submitViaFormInbox(payload);
}

async function submitViaFormInbox(payload: InquiryPayload) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(brand.email)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: inquirySubject(payload),
        _template: "table",
        _captcha: "false",
        _replyto: payload.email,
        Tegund:
          payload.kind === "booking" ? "Bókun mælingar" : "Hafa samband",
        Nafn: payload.name,
        Netfang: payload.email,
        Sími: payload.phone || "—",
        ...(payload.kind === "booking"
          ? { "Æskilegur tími": payload.when || "—" }
          : {}),
        Skilaboð: payload.message,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Gat ekki sent skilaboðin. Reyndu aftur.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("Gat ekki sent skilaboðin. Reyndu aftur.");
  }

  const data = (await response.json().catch(() => null)) as {
    success?: boolean | string;
  } | null;
  if (!data || data.success === false) {
    throw new Error("Gat ekki sent skilaboðin. Reyndu aftur.");
  }
}
