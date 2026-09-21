export const MAINTENANCE_COOKIE = "ttsuit_preview";

export function isMaintenanceEnabled() {
  const value = process.env.MAINTENANCE_MODE?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "on";
}

export function maintenanceBypassSecret() {
  return process.env.MAINTENANCE_BYPASS?.trim() || "";
}
