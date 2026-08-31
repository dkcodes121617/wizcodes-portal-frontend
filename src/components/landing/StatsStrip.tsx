"use client";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

const STATS = [
  { value: "3", label: "Domains", detail: "Web, AI & Mobile" },
  { value: "100%", label: "Hands-on", detail: "Real tasks, not slides" },
  { value: "2", label: "Plans", detail: "From ₹299" },
] as const;

export function StatsStrip() {
  return (
    <section className="stats-strip border-border/70 border-y" aria-label="Highlights">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-[color-mix(in_srgb,var(--color-border)_80%,transparent)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {STATS.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 0.08} className="px-6 py-8 text-center">
            <p className="text-brand text-3xl font-semibold tracking-tight sm:text-4xl">
              {stat.value}
            </p>
            <p className="text-ink mt-1 text-sm font-semibold">{stat.label}</p>
            <p className="text-ink-muted mt-0.5 text-xs">{stat.detail}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
