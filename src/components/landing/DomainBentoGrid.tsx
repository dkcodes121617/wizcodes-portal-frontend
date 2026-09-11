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
    <div className="mt-6 grid gap-2 sm:mt-10 sm:gap-5 lg:grid-cols-3">
      {domains.map((domain, index) => {
        const Icon = DOMAIN_ICONS[domain.id];

        return (
          <ScrollReveal key={domain.id} delay={index * 0.06}>
            <article className={`domain-card rounded-lg sm:rounded-xl ${domain.tintClass}`}>
              <div
                className={`domain-card-icon ${domain.accentClass} bg-surface border-border inline-flex h-8 w-8 items-center justify-center rounded-md border sm:h-11 sm:w-11 sm:rounded-lg`}
              >
                <Icon
                  className="h-4 w-4 sm:h-6 sm:w-6"
                  idSuffix={`bento-${domain.id}`}
                />
              </div>
              <h3 className="item-title mt-2 text-sm sm:mt-4 sm:text-base">{domain.name}</h3>
              <p className="section-body mt-1.5 text-xs leading-relaxed sm:mt-2 sm:text-sm">
                {domain.description}
              </p>
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
