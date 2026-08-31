"use client";

import Link from "next/link";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

export function FinalCtaSection() {
  return (
    <section className="final-cta-section section-pad relative overflow-hidden">
      <div className="final-cta-aurora" aria-hidden />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <p className="eyebrow text-ink-muted-on-dark/80">Ready when you are</p>
          <h2 className="text-ink-on-dark mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Start building something employers{" "}
            <span className="headline-shimmer-dark">actually notice</span>
          </h2>
          <p className="text-ink-muted-on-dark mt-4 text-base leading-relaxed sm:text-lg">
            Join WizCodes, pick your domain, complete real tasks, and walk away with proof of
            work — not just another certificate from a slideshow course.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="bg-brand hover:bg-brand-strong cta-glow inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white transition-colors"
            >
              Start your internship
            </Link>
            <Link
              href="/login"
              className="border-border-on-dark/30 text-ink-on-dark hover:bg-spotlight-nested inline-flex items-center justify-center rounded-full border px-8 py-3 text-sm font-medium transition-colors"
            >
              Sign in
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
