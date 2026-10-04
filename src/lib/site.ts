/**
 * Returns the canonical base URL for the site, resolving from:
 * 1. Explicit NEXT_PUBLIC_SITE_URL environment variable
 * 2. Vercel production deployment URL (VERCEL_PROJECT_PRODUCTION_URL)
 * 3. Vercel deployment preview URL (VERCEL_URL)
 * 4. Localhost fallback
 */
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
