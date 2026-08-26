import type { Metadata } from "next";
import { Cormorant_Garamond, Geist_Mono, Great_Vibes, Outfit } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/lib/site";

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
  metadataBase: new URL("https://ttsuit.is"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="is"
      className={`${outfit.variable} ${cormorant.variable} ${greatVibes.variable} ${geistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 bg-white">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
