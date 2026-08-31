"use client";

import { DOMAIN_ICONS, type DomainIconId } from "@/components/landing/domain-icons";
import { ScrollReveal } from "@/components/landing/ScrollReveal";

export interface DomainBentoItem {
  id: DomainIconId;
  name: string;
  description: string;
  accentClass: string;
  tintClass: string;
}

interface DomainBentoGridProps {
  domains: DomainBentoItem[];
}

export function DomainBentoGrid({ domains }: DomainBentoGridProps) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain, index) => {
        const Icon = DOMAIN_ICONS[domain.id];

        return (
          <ScrollReveal key={domain.id} delay={index * 0.1}>
            <article
              className={`domain-bento-card group ${domain.tintClass} relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-brand)_18%,var(--color-border))] p-6`}
            >
              <div
                className="domain-bento-glow pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-60"
                aria-hidden
              />
              <div
                className={`domain-bento-icon ${domain.accentClass} bg-surface/80 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-sm`}
              >
                <Icon className="h-7 w-7" idSuffix={`bento-${domain.id}`} />
              </div>
              <h3 className={`item-title ${domain.accentClass}`}>{domain.name}</h3>
              <p className="section-body mt-2">{domain.description}</p>
              <span
                className={`${domain.accentClass} mt-4 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              >
                Explore track
                <span aria-hidden>→</span>
              </span>
            </article>
          </ScrollReveal>
        );
      })}
    </div>
  );
}

export function DomainBentoHeader() {
  return (
    <ScrollReveal>
      <p className="eyebrow-brand">Choose your field</p>
      <h2 className="section-heading mt-3">Three domains, one serious internship</h2>
      <p className="section-lead">
        Every track gives you structured tasks with clear instructions — the difference is what
        you build.
      </p>
    </ScrollReveal>
  );
}
