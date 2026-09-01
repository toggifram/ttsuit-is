import type { MetadataRoute } from "next";

import { shopCategories } from "@/lib/product";
import { isProductionSite, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return paths.map((path, index) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: index === 0 ? 1 : 0.7,
  }));
}
