"use client";

import Link from "next/link";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

export function FinalCtaSection() {
  return (
    <section className="final-cta section-pad">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="display-heading-dark text-2xl sm:text-3xl md:text-4xl">
            Ready to start your internship?
          </h2>
          <p className="text-ink-muted-on-dark mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:mt-5 sm:text-base">
            Join students across India who are building portfolio-ready work with structured
            tasks, mentor support, and credentials that matter.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2.5 sm:mt-9 sm:gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary btn-primary-lg">
              Create your account
            </Link>
            <Link href="/login" className="btn-ghost-dark">
              Sign in
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
