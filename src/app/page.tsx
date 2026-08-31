import { AiMlIcon, MobileDevIcon, WebDevIcon } from "@/components/landing/domain-icons";
import { DomainBentoGrid, DomainBentoHeader } from "@/components/landing/DomainBentoGrid";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { HeroBadge } from "@/components/landing/HeroBadge";
import { HeroExperience } from "@/components/landing/HeroExperience";
import { ScrollProgress } from "@/components/landing/ScrollProgress";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { TrustMarquee } from "@/components/landing/TrustMarquee";
import Link from "next/link";
import type { CSSProperties } from "react";

/* -------------------------------------------------------------------------- */
/*  Domain data                                                               */
/* -------------------------------------------------------------------------- */

const DOMAINS = [
  {
    id: "web",
    name: "Web Development",
    heroDescription: "React, APIs, shipped code",
    sectionDescription:
      "Work through real front-end and back-end tasks — components, APIs, and deployable features.",
    tintClass: "bg-web-bg",
    accentClass: "text-web",
    dark: true,
    tiltClass: "card-tilt-1",
    positionClass: "left-1/2 top-0 z-20 w-36 -translate-x-1/2 sm:w-44 lg:-translate-x-[46%]",
    stagger: "0ms",
    Icon: WebDevIcon,
  },
  {
    id: "ai",
    name: "AI / ML",
    heroDescription: "Real datasets, real models",
    sectionDescription:
      "Experiment with models, fine-tune pipelines, and document results like you would on a real ML team.",
    tintClass: "bg-ai-bg",
    accentClass: "text-ai",
    dark: false,
    tiltClass: "card-tilt-2",
    positionClass: "bottom-2 left-0 z-10 w-32 sm:bottom-4 sm:w-36 lg:left-4",
    stagger: "140ms",
    Icon: AiMlIcon,
  },
  {
    id: "mobile",
    name: "Mobile Development",
    heroDescription: "Screens, hooks, shipped apps",
    sectionDescription:
      "Ship screens, navigation, and API hooks for mobile apps — portfolio-ready, not tutorial clones.",
    tintClass: "bg-mobile-bg",
    accentClass: "text-mobile",
    dark: false,
    tiltClass: "card-tilt-3",
    positionClass: "right-0 bottom-0 z-10 w-32 sm:bottom-2 sm:w-36 lg:right-2",
    stagger: "280ms",
    Icon: MobileDevIcon,
  },
] as const;

const STEPS = [
  {
    title: "Welcome Sign up",
    detail: "Create your student account with email or phone.",
  },
  {
    title: "Choose domain & plan",
    detail: "Pick the field and duration that fits your schedule.",
  },
  {
    title: "Pay & upload screenshot",
    detail: "Complete payment and submit proof for admin review.",
  },
  {
    title: "Get access & start tasks",
    detail: "Receive your assigned tasks and begin building.",
  },
  {
    title: "Earn your certificate",
    detail: "Finish your tasks and collect your offer letter plus certificate.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="text-xl font-semibold tracking-tight">
      <span className={dark ? "text-wordmark-wiz-dark" : "text-wordmark-wiz"}>Wiz</span>
      <span className={dark ? "text-wordmark-codes-dark" : "text-wordmark-codes"}>Codes</span>
    </span>
  );
}

const primaryBtn =
  "bg-brand hover:bg-brand-strong inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white transition-colors";
const outlineBtn =
  "border-brand/25 bg-surface hover:border-brand/50 hover:bg-baby-wash text-ink inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition-colors";
const ghostLink = "text-brand hover:text-brand-strong text-sm font-medium transition-colors";
const navLink = "text-ink-secondary hover:text-brand text-sm font-medium transition-colors";

/* -------------------------------------------------------------------------- */
/*  Hero domain card                                                          */
/* -------------------------------------------------------------------------- */

type Domain = (typeof DOMAINS)[number];

function HeroDomainCard({ domain }: { domain: Domain }) {
  const { Icon } = domain;

  return (
    <div
      className={`animate-card-settle ${domain.tiltClass} ${domain.positionClass} absolute`}
      style={{ "--stagger-delay": domain.stagger } as CSSProperties}
    >
      <div
        className={`hero-domain-card-surface border-border/60 border p-3 sm:p-4 ${
          domain.dark
            ? "hero-domain-card-surface-dark spotlight border-border-on-dark"
            : `${domain.tintClass} text-ink`
        }`}
      >
        <Icon className="mx-auto h-10 w-10 sm:h-12 sm:w-12" idSuffix={domain.id} />
        <p
          className={`mt-2 text-center text-xs font-semibold sm:text-sm ${
            domain.dark ? "text-ink-on-dark" : "text-ink"
          }`}
        >
          {domain.name}
        </p>
        <p
          className={`mt-0.5 text-center text-[10px] sm:text-xs ${
            domain.dark ? "text-ink-muted-on-dark" : "text-ink-secondary"
          }`}
        >
          {domain.heroDescription}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <>
      <ScrollProgress />

      {/* Nav */}
      <header className="glass-nav border-border/50 sticky top-0 z-50 border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="shrink-0">
            <Wordmark />
          </Link>

          <nav
            className="text-ink-secondary hidden items-center gap-8 text-sm font-medium md:flex"
            aria-label="Main"
          >
            <a href="#domains" className={navLink}>
              Domains
            </a>
            <a href="#pricing" className={navLink}>
              Pricing
            </a>
            <a href="#how-it-works" className={navLink}>
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className={ghostLink}>
              Sign In
            </Link>
            <Link href="/signup" className={primaryBtn}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <HeroExperience
          cards={DOMAINS.map((domain) => (
            <HeroDomainCard key={domain.id} domain={domain} />
          ))}
        >
          <HeroBadge />

          <p className="eyebrow mt-5">Internships that actually teach you something</p>

          <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
            Learn by building <span className="headline-shimmer">real projects</span>, not
            watching slides
          </h1>

          <p className="text-ink-secondary mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg">
            Pick a domain, get real tasks from our team with clear instructions, and finish with
            an offer letter and certificate you can show employers.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className={`${primaryBtn} cta-glow`}>
              Get started
            </Link>
            <a href="#how-it-works" className={outlineBtn}>
              See how it works
            </a>
          </div>

          <TrustMarquee />
        </HeroExperience>

        <StatsStrip />

        {/* Domains */}
        <section id="domains" className="section-pad scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <DomainBentoHeader />
            <DomainBentoGrid
              domains={DOMAINS.map((domain) => ({
                id: domain.id,
                name: domain.name,
                description: domain.sectionDescription,
                accentClass: domain.accentClass,
                tintClass: domain.tintClass,
              }))}
            />
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-pad section-accent-wash scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <p className="eyebrow-brand">Simple pricing</p>
              <h2 className="section-heading mt-3">Pick the plan that fits your pace</h2>
            </ScrollReveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <ScrollReveal delay={0.05}>
                <PricingCard
                  name="Basic"
                  price="₹299"
                  duration="2 to 6 weeks, you choose"
                  features={[
                    "Pick your duration within the range",
                    "Get randomly assigned real tasks",
                    "Offer letter + certificate on completion",
                  ]}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.12}>
                <PricingCard
                  name="Premium"
                  price="₹999"
                  duration="Up to 3 months, you choose"
                  features={[
                    "1:1 Assistance ",
                    "Hand-picked substantial tasks from our team",
                    "Offer letter + certificate on completion",
                  ]}
                  highlighted
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section-pad scroll-mt-20">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <p className="eyebrow-brand">How it works</p>
              <h2 className="section-heading mt-3">From signup to certificate</h2>
            </ScrollReveal>

            <ol className="divide-border border-brand/20 mt-10 space-y-0 divide-y border-y">
              {STEPS.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  as="li"
                  delay={index * 0.06}
                  className="flex gap-5 py-6"
                >
                  <span className="bg-brand text-surface flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="item-title">{step.title}</h3>
                    <p className="section-body mt-1.5">{step.detail}</p>
                  </div>
                </ScrollReveal>
              ))}
            </ol>
          </div>
        </section>

        <FinalCtaSection />
      </main>

      {/* Footer */}
      <footer className="border-border section-pad border-t !py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <nav className="text-ink-secondary flex flex-wrap gap-6 text-sm" aria-label="Footer">
            <a href="#domains" className={navLink}>
              Domains
            </a>
            <a href="#pricing" className={navLink}>
              Pricing
            </a>
            <Link href="/login" className={navLink}>
              Sign In
            </Link>
            <Link href="/signup" className={navLink}>
              Sign Up
            </Link>
          </nav>
          <p className="section-supporting">
            © {new Date().getFullYear()} WizCodes. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

function PricingCard({
  name,
  price,
  duration,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  duration: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <article
      className={`pricing-card relative flex h-full flex-col overflow-hidden rounded-xl border p-8 shadow-sm ${
        highlighted
          ? "pricing-card-premium border-brand ring-brand/20 ring-2"
          : "bg-surface border-border hover:border-brand/30"
      }`}
    >
      {highlighted ? (
        <span className="popular-badge bg-brand text-surface absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-semibold tracking-wide uppercase">
          Most popular
        </span>
      ) : null}
      <h3 className={`item-title ${highlighted ? "text-brand" : ""}`}>{name}</h3>
      <p className="text-brand mt-3 text-3xl font-semibold tracking-tight">
        {price}
        <span className="section-supporting text-ink-secondary font-normal"> / internship</span>
      </p>
      <p className="section-supporting mt-2">{duration}</p>

      <ul className="section-body mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2.5">
            <span className="text-brand mt-0.5 shrink-0 font-semibold" aria-hidden>
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Link href="/signup" className={`${primaryBtn} mt-8 w-full`}>
        Get started
      </Link>
    </article>
  );
}
