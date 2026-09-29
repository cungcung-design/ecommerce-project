export const SHOP_PATH = "/shop";

export function getSafeRedirect(value, fallback = SHOP_PATH) {
  if (typeof value !== "string") return fallback;

  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\") || path.includes("://")) {
    return fallback;
  }

  return path;
}

export function destinationAfterAuth(user, redirectTo) {
  if (user?.role === "ADMIN") return "/admin";
  return getSafeRedirect(redirectTo, SHOP_PATH);
}
