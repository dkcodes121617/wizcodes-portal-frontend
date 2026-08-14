/**
 * Deployment URLs, in one place.
 *
 * These are the *fallbacks* the app uses when an environment variable is not
 * set. Setting `NEXT_PUBLIC_API_URL` always wins — this only means a forgotten
 * variable degrades to the correct production URL instead of breaking the site.
 *
 * They are public endpoints, not secrets, so hardcoding them is safe. If a URL
 * ever changes, change it here: `env.ts` (runtime client) and `next.config.ts`
 * (CSP `connect-src`) both read from this file, so the two cannot drift apart.
 */

/** Where `python main.py` serves during local development. */
export const LOCAL_API_URL = "http://localhost:8000";

/** The Render service. */
export const PRODUCTION_API_URL = "https://wizcodes-portal-backend.onrender.com";

/** The Vercel deployment (canonical origin for OG/canonical URLs). */
export const PRODUCTION_SITE_URL = "https://wizcodes-portal-frontend.vercel.app";

/**
 * The API base URL to assume when `NEXT_PUBLIC_API_URL` is absent.
 * Production builds point at Render; everything else at localhost.
 */
export function fallbackApiUrl(isProductionBuild: boolean): string {
  return isProductionBuild ? PRODUCTION_API_URL : LOCAL_API_URL;
}
