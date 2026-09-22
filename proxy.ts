import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  MAINTENANCE_COOKIE,
  isMaintenanceEnabled,
  maintenanceBypassSecret,
} from "@/lib/maintenance";

export function proxy(request: NextRequest) {
  if (!isMaintenanceEnabled()) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/opna")) return NextResponse.next();

  const secret = maintenanceBypassSecret();
  if (secret && request.cookies.get(MAINTENANCE_COOKIE)?.value === secret) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/webhooks/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Síðan er í uppfærslu." },
      { status: 503 }
    );
  }

  if (pathname !== "/vidhald") {
    const dest = request.nextUrl.clone();
    dest.pathname = "/vidhald";
    dest.search = "";
    return NextResponse.rewrite(dest);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_next/hmr|_next/webpack-hmr|brand/|icon.png|apple-icon.png|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
