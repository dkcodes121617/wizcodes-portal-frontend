"use client";

import Link from "next/link";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

export function HeroCtaButtons() {
  const signedIn = useIsAuthenticated();

  return (
    <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-8 sm:flex-row sm:gap-3">
      {signedIn ? (
        <Link href="/dashboard" className="btn-primary btn-primary-lg">
          Go to dashboard
        </Link>
      ) : (
        <Link href="/signup" className="btn-primary btn-primary-lg">
          Start internship
        </Link>
      )}
      <a href="#domains" className="btn-secondary">
        View domains
      </a>
    </div>
  );
}
