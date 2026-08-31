import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
  const kind =
    data.kind === "booking" ? "booking" : data.kind === "contact" ? "contact" : "";
  const name = readString(data.name);
  const email = readString(data.email);
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
    return NextResponse.json(
      { error: "Settu inn gilt netfang." },
      { status: 400 }
    );
  }
  if (message.length < 4) {
    return NextResponse.json(
      { error: "Skrifaðu stutta lýsingu." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true });
}
