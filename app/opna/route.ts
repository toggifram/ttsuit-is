import { NextResponse } from "next/server";

import {
  MAINTENANCE_COOKIE,
  maintenanceBypassSecret,
} from "@/lib/maintenance";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kodi = url.searchParams.get("kodi")?.trim() ?? "";
  const secret = maintenanceBypassSecret();
  const home = new URL("/", request.url);

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
