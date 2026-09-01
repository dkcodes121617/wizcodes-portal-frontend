import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { PRODUCTION_SITE_URL } from "@/lib/urls";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * `metadataBase` resolves relative OG/canonical URLs.
 *
 * Resolution order matters: production must use the stable domain, not the
 * per-deployment VERCEL_URL (`…-abc123.vercel.app`), or every deploy would
 * publish different canonical URLs. Previews still use VERCEL_URL, which is
 * exactly what you want there.
 */
const siteUrl = (() => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  if (process.env.VERCEL_ENV === "production") return new URL(PRODUCTION_SITE_URL);
  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);
  return new URL("http://localhost:3000");
})();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "WizCodes Portal",
    template: "%s | WizCodes Portal",
  },
  description: "WizCodes company portal.",
  applicationName: "WizCodes Portal",
  robots: {
    // Keep previews out of search results; production is opted in explicitly.
    index: process.env.VERCEL_ENV === "production",
    follow: process.env.VERCEL_ENV === "production",
  },
  openGraph: {
    type: "website",
    siteName: "WizCodes Portal",
    title: "WizCodes Portal",
    description: "WizCodes company portal.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F9FB",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-canvas text-ink flex min-h-full flex-col">{children}</body>
    </html>
  );
}
