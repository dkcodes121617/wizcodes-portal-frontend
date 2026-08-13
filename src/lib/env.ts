/**
 * Environment access, validated once at module load.
 *
 * `NEXT_PUBLIC_API_URL` is the single variable that links the frontend to the
 * backend. Nothing else in the app should read `process.env` for the API host —
 * import `env` from here instead.
 *
 * The rules are deliberately forgiving locally and strict in production:
 *
 *   local dev   -> unset is fine, it falls back to http://localhost:8000,
 *                  which is exactly where `python main.py` serves. No .env
 *                  file is needed to start working.
 *   production  -> unset is a hard build failure with a message that says
 *                  where to set it. Better a red build than a site that
 *                  silently fetches from the wrong place.
 *
 * Next.js inlines `NEXT_PUBLIC_*` at build time, so these must be referenced by
 * their full literal name — never `process.env[someVariable]` — and a change
 * requires a redeploy, not just a restart.
 */

/** Where `python main.py` listens by default. */
const LOCAL_API_FALLBACK = "http://localhost:8000";

function readApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isProductionBuild = process.env.NODE_ENV === "production";

  if (!raw) {
    if (!isProductionBuild) return LOCAL_API_FALLBACK;

    throw new Error(
      "NEXT_PUBLIC_API_URL is not set for this production build.\n" +
        "Set it in Vercel: Project -> Settings -> Environment Variables, e.g.\n" +
        "  NEXT_PUBLIC_API_URL = https://wizcodes-portal-backend.onrender.com",
    );
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_API_URL is not a valid absolute URL: "${raw}".\n` +
        "It must include the scheme, e.g. https://wizcodes-portal-backend.onrender.com",
    );
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`NEXT_PUBLIC_API_URL must be http or https, got "${parsed.protocol}"`);
  }

  // Strip the trailing slash so callers can always join with a leading-slash path.
  return parsed.toString().replace(/\/+$/, "");
}

export const env = {
  /** Base URL of the backend API, without a trailing slash. */
  apiUrl: readApiUrl(),
  /** True for Vercel production and preview builds alike. */
  isProduction: process.env.NODE_ENV === "production",
  /** "production" | "preview" | "development" on Vercel; undefined locally. */
  vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV,
} as const;

export type Env = typeof env;
