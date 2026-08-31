"use client";

import Link from "next/link";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

export function FinalCtaSection() {
  return (
    <section className="final-cta section-pad">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <h2 className="display-heading-dark text-3xl sm:text-4xl">
            Ready to start your internship?
          </h2>
          <p className="text-ink-muted-on-dark mx-auto mt-5 max-w-2xl text-base leading-relaxed">
            Join students across India who are building portfolio-ready work with structured
            tasks, mentor support, and credentials that matter.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
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
