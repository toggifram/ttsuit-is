import type { MetadataRoute } from "next";

import { SHARE_CRAWLER_AGENTS, isMaintenanceEnabled } from "@/lib/maintenance";
import { isProductionSite, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isProductionSite()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  if (isMaintenanceEnabled()) {
    return {
      rules: [
        { userAgent: "*", disallow: "/" },
        ...SHARE_CRAWLER_AGENTS.map((userAgent) => ({
          userAgent,
          allow: "/",
        })),
      ],
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/kassi", "/vidhald", "/opna", "/pontunarpostur", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
