"use client";

import { usePathname } from "next/navigation";

import { CartDrawer } from "@/components/cart-drawer";
import { SiteHeader } from "@/components/site-header";
import { SiteOverlays } from "@/components/site-overlays";

export function AppChrome({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/prentun")) {
    return <div className="min-h-full bg-cream">{children}</div>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 bg-white">{children}</main>
      {footer}
      <CartDrawer />
      <SiteOverlays />
    </>
  );
}
