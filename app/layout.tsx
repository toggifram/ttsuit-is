import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, Geist_Mono, Great_Vibes, Outfit } from "next/font/google";

import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { MaintenanceScreen } from "@/components/maintenance-screen";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteOverlays } from "@/components/site-overlays";
import {
  MAINTENANCE_COOKIE,
  isMaintenanceEnabled,
  maintenanceBypassSecret,
} from "@/lib/maintenance";
import { brand, siteUrl } from "@/lib/site";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — Sérsaumur og tilbúin föt`,
    template: `%s · ${brand.name}`,
  },
  description:
    "Tjé Tjé er herrafatnaður á Íslandi: sérsaumuð jakkaföt og tilbúin föt. Bókaðu mælingu eða skoðaðu verslunina.",
  metadataBase: new URL(siteUrl()),
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

async function isMaintenanceLocked() {
  if (!isMaintenanceEnabled()) return false;
  const secret = maintenanceBypassSecret();
  if (!secret) return true;
  const jar = await cookies();
  return jar.get(MAINTENANCE_COOKIE)?.value !== secret;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locked = await isMaintenanceLocked();
  const fontClass = `${outfit.variable} ${cormorant.variable} ${greatVibes.variable} ${geistMono.variable} h-full`;

  if (locked) {
    return (
      <html lang="is" className={fontClass}>
        <body className="min-h-full bg-forest">
          <MaintenanceScreen />
        </body>
      </html>
    );
  }

  return (
    <html lang="is" className={fontClass}>
      <body className="flex min-h-full flex-col">
        <div id="top" className="h-0 w-0 overflow-hidden" />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1 bg-white">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <SiteOverlays />
        </CartProvider>
      </body>
    </html>
  );
}
