import { NextResponse } from "next/server";

import { subscribeToMailchimp } from "@/lib/mailchimp";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ógild beiðni." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body && "email" in body
      ? String((body as { email: unknown }).email).trim()
      : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "Settu inn gilt netfang." },
      { status: 400 }
    );
  }

  try {
    await subscribeToMailchimp(email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "missing_config") {
      return NextResponse.json(
        { error: "Póstlistinn er ekki tengdur enn." },
        { status: 503 }
      );
    }
    if (error instanceof Error && error.message === "invalid_email") {
      return NextResponse.json(
        { error: "Settu inn gilt netfang." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Gat ekki skráð netfangið. Reyndu aftur." },
      { status: 502 }
    );
  }
}
