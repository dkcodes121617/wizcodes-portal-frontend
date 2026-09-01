import Link from "next/link";

import { SUPPORT_EMAIL, SUPPORT_EMAIL_HREF } from "@/lib/support";

function Wordmark() {
  return (
    <span className="text-xl font-bold tracking-tight">
      <span className="text-wordmark-wiz">Wiz</span>
      <span className="text-wordmark-codes">Codes</span>
    </span>
  );
}

const footerLink = "text-ink-secondary hover:text-ink text-sm transition-colors";

export function LandingFooter() {
  return (
    <footer className="landing-footer border-border border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Wordmark />
            <p className="text-ink-secondary mt-4 max-w-sm text-sm leading-relaxed">
              Hands-on internships for students in India. Build projects, earn credentials, and
              prepare for your first role.
            </p>
            <p className="text-ink-secondary mt-4 max-w-sm text-sm leading-relaxed">
              For any support or payment-related queries, contact us at{" "}
              <a href={SUPPORT_EMAIL_HREF} className={`${footerLink} font-medium`}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div>
            <p className="text-ink text-sm font-semibold">Product</p>
            <nav className="mt-4 flex flex-col gap-3" aria-label="Footer product links">
              <a href="#domains" className={footerLink}>
                Domains
              </a>
              <a href="#pricing" className={footerLink}>
                Pricing
              </a>
              <a href="#how-it-works" className={footerLink}>
                How it works
              </a>
            </nav>
          </div>

          <div>
            <p className="text-ink text-sm font-semibold">Account</p>
            <nav className="mt-4 flex flex-col gap-3" aria-label="Footer account links">
              <Link href="/login" className={footerLink}>
                Sign in
              </Link>
              <Link href="/signup" className={footerLink}>
                Create account
              </Link>
              <Link href="/enroll" className={footerLink}>
                Enroll
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col gap-2 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ink-muted text-xs">© {new Date().getFullYear()} WizCodes</p>
          <p className="text-ink-muted text-xs">Internships for Web, AI, and Mobile</p>
        </div>
      </div>
    </footer>
  );
}
