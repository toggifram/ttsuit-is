import type { Metadata } from "next";

import {
  categoryLooks,
  imagesForSelectedColor,
  type Product,
} from "@/lib/product";
import { brand, faqs, siteUrl } from "@/lib/site";

export type ShareImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export const HOME_OG_IMAGES: ShareImage[] = [
  {
    url: "/images/studio/og-home.jpg",
    alt: "Tjé Tjé — sérsaumur og vefverslun",
    width: 1200,
    height: 630,
  },
  {
    url: "/images/studio/sersaumur-hero.png",
    alt: "Sérsaumur hjá Tjé Tjé",
    width: 1086,
    height: 1448,
  },
  {
    url: "/images/studio/shop-look.jpg",
    alt: "Vefverslun Tjé Tjé",
    width: 2061,
    height: 1981,
  },
];

const SITE_DESCRIPTION =
  "Tjé Tjé er herrafatnaður á Íslandi: sérsaumuð jakkaföt og tilbúin föt. Bókaðu mælingu eða skoðaðu verslunina.";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function shareImageUrl(url: string) {
  const abs = absoluteUrl(url);
  try {
    const parsed = new URL(abs);
    if (parsed.hostname.includes("shopify.com")) {
      parsed.searchParams.set("width", "1200");
    }
    return parsed.toString();
  } catch {
    return abs;
  }
}

export function ogImages(
  images: ShareImage[]
): NonNullable<NonNullable<Metadata["openGraph"]>["images"]> {
  return images.map((image) => ({
    url: shareImageUrl(image.url),
    alt: image.alt,
    width: image.width ?? 1200,
    height: image.height ?? 630,
    type: imageType(image.url),
  }));
}

function imageType(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function titled(title: string) {
  return title.includes(brand.name) ? title : `${title} · ${brand.name}`;
}

export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  url?: string;
  images?: ShareImage[];
  robots?: Metadata["robots"];
  type?: "website" | "article";
  priceAmount?: number;
  availability?: "in stock" | "out of stock";
}): Metadata {
  const images = input.images?.length ? input.images : [...HOME_OG_IMAGES];
  const url = absoluteUrl(input.url || input.path);
  const socialTitle = titled(input.title);
  const other: Record<string, string> = {};
  if (typeof input.priceAmount === "number" && Number.isFinite(input.priceAmount)) {
    other["product:price:amount"] = String(Math.round(input.priceAmount));
    other["product:price:currency"] = "ISK";
  }
  if (input.availability) {
    other["product:availability"] = input.availability;
  }

  return {
    title: input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      languages: { is: input.path, "x-default": input.path },
    },
    robots: input.robots,
    openGraph: {
      type: input.type ?? "website",
      locale: "is_IS",
      siteName: brand.name,
      title: socialTitle,
      description: input.description,
      url,
      images: ogImages(images),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: input.description,
      images: images.map((image) => shareImageUrl(image.url)),
    },
    other: Object.keys(other).length ? other : undefined,
  };
}

export function productShareImages(product: Product, color?: string): ShareImage[] {
  const urls = imagesForSelectedColor(product, color);
  const seen = new Set<string>();
  const images: ShareImage[] = [];
  for (const url of urls) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    images.push({
      url,
      alt: color ? `${product.title}, ${color}` : product.imageAlt || product.title,
      width: 1200,
      height: 1200,
    });
  }
  return images.length ? images : [...HOME_OG_IMAGES];
}

export function categoryShareImage(slug: string): ShareImage {
  const look = categoryLooks.find((row) => row.href === `/verslun/${slug}`);
  if (!look) {
    return {
      url: "/images/studio/allar-vorur.jpg",
      alt: "Vefverslun Tjé Tjé",
      width: 1200,
      height: 630,
    };
  }
  return { url: look.image, alt: look.alt, width: 1200, height: 630 };
}

export function productDescription(product: Product) {
  const text = product.description?.replace(/\s+/g, " ").trim();
  if (text) return text.length > 180 ? `${text.slice(0, 177).trim()}…` : text;
  return `${product.title} — ${product.subtitle} í vefverslun ${brand.name}.`;
}

export function lowestPrice(product: Product) {
  const prices = product.variants
    ?.map((variant) => variant.priceAmount)
    .filter((amount) => Number.isFinite(amount))
    .sort((a, b) => a - b);
  return prices?.[0];
}

export function productAvailable(product: Product) {
  return (
    product.available !== false &&
    (product.variants?.some((variant) => variant.available) ?? true)
  );
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": absoluteUrl("/#store"),
    name: brand.name,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    email: brand.email,
    image: HOME_OG_IMAGES.map((image) => absoluteUrl(image.url)),
    logo: absoluteUrl("/brand/logo.png"),
    sameAs: [brand.instagram, brand.facebook, brand.tiktok],
    address: {
      "@type": "PostalAddress",
      addressCountry: "IS",
    },
    areaServed: { "@type": "Country", name: "Iceland" },
    currenciesAccepted: "ISK",
    paymentAccepted: "Credit Card",
    inLanguage: "is",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: brand.name,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "is",
    publisher: { "@id": absoluteUrl("/#store") },
  };
}

export function productJsonLd(product: Product, color?: string) {
  const images = productShareImages(product, color).map((image) =>
    shareImageUrl(image.url)
  );
  const available = productAvailable(product);
  const price = lowestPrice(product);
  const url = absoluteUrl(product.href);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: color ? `${product.title} — ${color}` : product.title,
    description: productDescription(product),
    image: images,
    sku: product.handle,
    category: product.subtitle,
    color: color || undefined,
    brand: { "@type": "Brand", name: brand.name },
    url,
    mainEntityOfPage: url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "ISK",
      price: price ?? undefined,
      itemCondition: "https://schema.org/NewCondition",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": absoluteUrl("/#store") },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function collectionJsonLd(input: {
  name: string;
  path: string;
  description?: string;
  products: Product[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    url: absoluteUrl(input.path),
    description: input.description,
    isPartOf: { "@id": absoluteUrl("/#website") },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: input.products.length,
      itemListElement: input.products.slice(0, 50).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(product.href),
        name: product.title,
        image: shareImageUrl(product.image),
      })),
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function aboutJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `Um ${brand.name}`,
    url: absoluteUrl("/um-okkur"),
    description:
      "Sagan á bak við Tjé Tjé — Toggi Tuttugu og sérsaumaður herrafatnaður á Íslandi.",
    mainEntity: { "@id": absoluteUrl("/#store") },
  };
}

export function contactJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Hafa samband",
    url: absoluteUrl("/hafa-samband"),
    description: "Sendu okkur línu. Við svörum innan 48 klukkustunda.",
    mainEntity: { "@id": absoluteUrl("/#store") },
  };
}
