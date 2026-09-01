"use client";

import { ScrollReveal } from "@/components/landing/ScrollReveal";

export interface TimelineStep {
  title: string;
  detail: string;
}

interface HowItWorksTimelineProps {
  steps: TimelineStep[];
}

export function HowItWorksTimeline({ steps }: HowItWorksTimelineProps) {
  return (
    <section id="how-it-works" className="section-pad section-surface scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="section-eyebrow">How it works</p>
          <h2 className="section-heading mt-3">A clear path from signup to certificate</h2>
        </ScrollReveal>

        <ol className="process-list mt-8 sm:mt-12">
          {steps.map((step, index) => (
            <ScrollReveal
              key={step.title}
              delay={index * 0.05}
              as="li"
              className="process-step"
            >
              <div className="process-index">{index + 1}</div>
              <div>
                <h3 className="item-title">{step.title}</h3>
                <p className="section-body mt-2 text-sm">{step.detail}</p>
              </div>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
