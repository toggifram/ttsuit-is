import type { MetadataRoute } from "next";

import { getCatalogProducts } from "@/lib/catalog";
import { shopCategories } from "@/lib/product";
import { isProductionSite, siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isProductionSite()) return [];

  const base = siteUrl();
  const now = new Date();

  const paths = [
    "/",
    "/sersaumur",
    "/verslun",
    ...shopCategories.filter((cat) => cat.slug).map((cat) => `/verslun/${cat.slug}`),
    "/hafa-samband",
    "/um-okkur",
    "/skilmalar",
    "/vafrakokur",
  ];

  const pages: MetadataRoute.Sitemap = paths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/verslun" ? "weekly" : "monthly",
    priority: index === 0 ? 1 : path.startsWith("/verslun") ? 0.8 : 0.7,
  }));

  try {
    const products = await getCatalogProducts();
    for (const product of products) {
      pages.push({
        url: `${base}/verslun/vara/${product.handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  } catch {
    // Catalog fetch failure should not hide the rest of the sitemap.
  }

  return pages;
}
