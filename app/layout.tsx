import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
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
  isShareCrawler,
  maintenanceBypassSecret,
} from "@/lib/maintenance";
import { JsonLd } from "@/components/json-ld";
import {
  HOME_OG_IMAGES,
  organizationJsonLd,
  pageMetadata,
  websiteJsonLd,
} from "@/lib/seo";
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

const defaultDescription =
  "Tjé Tjé er herrafatnaður á Íslandi: sérsaumuð jakkaföt og tilbúin föt. Bókaðu mælingu eða skoðaðu verslunina.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: `${brand.name} — Sérsaumur og tilbúin föt`,
    description: defaultDescription,
    path: "/",
    images: [...HOME_OG_IMAGES],
  }),
  title: {
    default: `${brand.name} — Sérsaumur og tilbúin föt`,
    template: `%s · ${brand.name}`,
  },
  metadataBase: new URL(siteUrl()),
  applicationName: brand.name,
  authors: [{ name: brand.name, url: siteUrl() }],
  creator: brand.name,
  publisher: brand.name,
  category: "shopping",
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

async function isMaintenanceLocked() {
  if (!isMaintenanceEnabled()) return false;
  const hdrs = await headers();
  if (isShareCrawler(hdrs.get("user-agent"))) return false;
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
          <JsonLd data={organizationJsonLd()} />
          <JsonLd data={websiteJsonLd()} />
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
