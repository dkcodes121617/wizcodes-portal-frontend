import type { NextConfig } from "next";

import { fallbackApiUrl } from "./src/lib/urls";

const isDev = process.env.NODE_ENV === "development";

/**
 * The backend origin is allow-listed in connect-src so the browser may call it.
 * It resolves through the same fallback the runtime client uses, so the CSP and
 * the API client cannot drift apart — including when the variable is unset.
 */
const apiOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim() || fallbackApiUrl(!isDev);
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js inlines its bootstrap script; dev additionally needs eval for HMR.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  ["connect-src 'self'", apiOrigin, isDev ? "ws: wss:" : ""].filter(Boolean).join(" "),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Vercel serves over HTTPS; the header is ignored on plain-HTTP local dev.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  typedRoutes: true,

  // Do not advertise the framework.
  poweredByHeader: false,

  // Fail the production build on type errors rather than shipping them.
  // (Linting is a separate `npm run lint` step in CI — Next 16 dropped the
  // `eslint` config key along with `next lint`.)
  typescript: { ignoreBuildErrors: false },

  compiler: {
    // Strip console output in production, keeping error/warn for observability.
    removeConsole: isDev ? false : { exclude: ["error", "warn"] },
  },

  images: {
    formats: ["image/avif", "image/webp"],
    // Add remote hosts here as they are needed, e.g.
    // remotePatterns: [{ protocol: "https", hostname: "images.example.com" }],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
