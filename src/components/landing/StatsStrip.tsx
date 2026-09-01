"use client";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

const STATS = [
  { value: "₹299", label: "Starting price", detail: "Basic internship plan" },
  { value: "3", label: "Domains", detail: "Web, AI, and Mobile" },
  { value: "5", label: "Steps", detail: "From signup to certificate" },
  { value: "100%", label: "Practical", detail: "Task-led curriculum" },
] as const;

export function StatsStrip() {
  return (
    <section className="stats-band" aria-label="Platform highlights">
      <div className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <ScrollReveal
            key={stat.label}
            delay={index * 0.04}
            className="stats-band-cell px-4 py-5 text-center sm:px-8 sm:py-8"
          >
            <p className="stats-band-value">{stat.value}</p>
            <p className="stats-band-label">{stat.label}</p>
            <p className="stats-band-detail">{stat.detail}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
