export const MAINTENANCE_COOKIE = "ttsuit_preview";

/** Facebook, Instagram, Slack and similar need the real page to show a share image. */
export const SHARE_CRAWLER_AGENTS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "slackbot",
  "telegrambot",
  "discordbot",
  "pinterest",
  "iframely",
  "embedly",
] as const;

export function isShareCrawler(userAgent: string | null | undefined) {
  const ua = userAgent?.toLowerCase() ?? "";
  return SHARE_CRAWLER_AGENTS.some((bot) => ua.includes(bot));
}

export function isMaintenanceEnabled() {
  // The lock is only for the public Netlify site. Local / Preview stays open.
  if (process.env.NODE_ENV !== "production") return false;
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (/127\.0\.0\.1|localhost/i.test(site)) return false;

  const value = process.env.MAINTENANCE_MODE?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "on";
}

export function maintenanceBypassSecret() {
  return process.env.MAINTENANCE_BYPASS?.trim() || "";
}
