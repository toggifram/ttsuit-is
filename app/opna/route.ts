import { NextResponse } from "next/server";

import {
  MAINTENANCE_COOKIE,
  maintenanceBypassSecret,
} from "@/lib/maintenance";

export const dynamic = "force-dynamic";

function homeUrl(request: Request) {
  const incoming = new URL(request.url);
  const forwarded = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwarded || incoming.host;
  const proto =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    incoming.protocol.replace(":", "") ||
    "https";
  return new URL(`${proto}://${host}/`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kodi = url.searchParams.get("kodi")?.trim() ?? "";
  const secret = maintenanceBypassSecret();
  const home = homeUrl(request);

  if (!secret || kodi !== secret) {
    return NextResponse.redirect(home);
  }

  const res = NextResponse.redirect(home);
  res.cookies.set(MAINTENANCE_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
