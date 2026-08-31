"use client";

import {
  CertificateIcon,
  MentorIcon,
  StudentIcon,
  TaskIcon,
} from "@/components/landing/landing-icons";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import type { ComponentType } from "react";

const VALUES: {
  title: string;
  detail: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  {
    title: "Task-based learning",
    detail: "Each assignment includes a title, description, and tech stack — like real work.",
    Icon: TaskIcon,
  },
  {
    title: "Made for students in India",
    detail: "Affordable plans from ₹299 with a single upfront payment.",
    Icon: StudentIcon,
  },
  {
    title: "Verified credentials",
    detail: "Earn an offer letter and certificate when you complete your track.",
    Icon: CertificateIcon,
  },
  {
    title: "Premium mentorship",
    detail: "Upgrade for guided support and carefully selected project tasks.",
    Icon: MentorIcon,
  },
];

export function WhySection() {
  return (
    <section id="why" className="section-pad scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <p className="section-eyebrow">Why WizCodes</p>
          <h2 className="section-heading mt-3 max-w-2xl">
            An internship that feels like your first role
          </h2>
          <p className="section-lead">
            We focus on practical work, clear expectations, and outcomes you can show in
            interviews.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item, index) => (
            <ScrollReveal key={item.title} delay={index * 0.05}>
              <article className="value-card h-full rounded-xl p-6">
                <span className="value-card-icon text-brand" aria-hidden>
                  <item.Icon className="h-5 w-5" />
                </span>
                <h3 className="item-title mt-5">{item.title}</h3>
                <p className="section-body mt-2 text-sm">{item.detail}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
