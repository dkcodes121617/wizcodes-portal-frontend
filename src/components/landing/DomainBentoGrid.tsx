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
    <div className="mt-10 grid gap-5 lg:grid-cols-3">
      {domains.map((domain, index) => {
        const Icon = DOMAIN_ICONS[domain.id];

        return (
          <ScrollReveal key={domain.id} delay={index * 0.06}>
            <article className={`domain-card ${domain.tintClass}`}>
              <div
                className={`domain-card-icon ${domain.accentClass} bg-surface border-border inline-flex h-11 w-11 items-center justify-center rounded-lg border`}
              >
                <Icon className="h-6 w-6" idSuffix={`bento-${domain.id}`} />
              </div>
              <h3 className="item-title mt-5">{domain.name}</h3>
              <p className="section-body mt-2 text-sm">{domain.description}</p>
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
      <p className="section-eyebrow">Domains</p>
      <h2 className="section-heading mt-3 max-w-2xl">
        Choose the track that matches your goals
      </h2>
      <p className="section-lead">
        Each domain follows the same structured process — real tasks, clear deliverables, and a
        certificate when you finish.
      </p>
    </ScrollReveal>
  );
}
