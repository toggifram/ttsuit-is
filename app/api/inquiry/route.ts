import { NextResponse } from "next/server";

import { brand } from "@/lib/site";
import {
  inquirySubject,
  inquiryText,
  type InquiryKind,
} from "@/lib/send-inquiry";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function sendWithResend(payload: {
  kind: InquiryKind;
  name: string;
  email: string;
  phone: string;
  when: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const from =
    process.env.INQUIRY_FROM?.trim() || "Tjé Tjé <onboarding@resend.dev>";
  const to = process.env.INQUIRY_TO?.trim() || brand.email;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: inquirySubject(payload),
      text: inquiryText(payload),
    }),
  });

  if (!response.ok) {
    throw new Error("resend_error");
  }
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const kind = data.kind === "booking" ? "booking" : data.kind === "contact" ? "contact" : "";
  const name = readString(data.name);
  const email = readString(data.email);
  const phone = readString(data.phone);
  const when = readString(data.when);
  const message = readString(data.message);
  const honey = readString(data.company);

  if (honey) {
    return NextResponse.json({ ok: true });
  }

  if (kind !== "contact" && kind !== "booking") {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "Settu inn nafn." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "Settu inn gilt netfang." }, { status: 400 });
  }
  if (message.length < 4) {
    return NextResponse.json({ error: "Skrifaðu stutta lýsingu." }, { status: 400 });
  }

  const payload = { kind, name, email, phone, when, message };

  try {
    const sent = await sendWithResend(payload);
    if (sent) return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Gat ekki sent skilaboðin. Reyndu aftur." },
      { status: 502 }
    );
  }

  return NextResponse.json({ fallback: true }, { status: 503 });
}
