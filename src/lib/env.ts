/**
 * Environment access, validated once at module load.
 *
 * `NEXT_PUBLIC_API_URL` is the single variable that links the frontend to the
 * backend. Nothing else in the app should read `process.env` for the API host —
 * import `env` from here instead.
 *
 * Nothing has to be configured for the app to work in either place:
 *
 *   local dev   -> falls back to http://localhost:8000, exactly where
 *                  `python main.py` serves. No .env file needed.
 *   production  -> falls back to the deployed Render service.
 *
 * Setting the variable always wins; the fallbacks only stop a forgotten
 * variable from breaking the site. Both live in `urls.ts` so the runtime
 * client and the CSP in `next.config.ts` can never disagree.
 *
 * A value that IS set but malformed still throws — that is a typo, not an
 * omission, and silently ignoring it would be worse than failing.
 *
 * Next.js inlines `NEXT_PUBLIC_*` at build time, so these must be referenced by
 * their full literal name — never `process.env[someVariable]` — and a change
 * requires a redeploy, not just a restart.
 */

import { fallbackApiUrl } from "@/lib/urls";

function readApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  const isProductionBuild = process.env.NODE_ENV === "production";

  if (!raw) return fallbackApiUrl(isProductionBuild);

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
