import Link from "next/link";
import type { CSSProperties, SVGProps } from "react";

/* -------------------------------------------------------------------------- */
/*  Domain data                                                               */
/* -------------------------------------------------------------------------- */

const DOMAINS = [
  {
    id: "web",
    name: "Web Development",
    heroDescription: "React, APIs, shipped code",
    sectionDescription:
      "Work through real front-end and back-end tasks in a GitHub repo — components, APIs, and deployable features.",
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
    detail: "Receive your GitHub repo link and begin assigned work.",
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
/*  Clay-style domain icons (token colors only)                               */
/* -------------------------------------------------------------------------- */

type DomainIconProps = SVGProps<SVGSVGElement> & { idSuffix?: string };

function WebDevIcon({ idSuffix = "web", ...props }: DomainIconProps) {
  const body = `web-body-${idSuffix}`;
  const screen = `web-screen-${idSuffix}`;
  const shine = `web-shine-${idSuffix}`;

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient id={body} x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-web)" />
          <stop offset="1" stopColor="var(--color-brand-strong)" />
        </linearGradient>
        <linearGradient
          id={screen}
          x1="10"
          y1="18"
          x2="38"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-web-bg)" />
        </linearGradient>
        <linearGradient
          id={shine}
          x1="8"
          y1="10"
          x2="28"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--color-surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="5" y="9" width="38" height="30" rx="7" fill={`url(#${body})`} />
      <rect
        x="8"
        y="12"
        width="32"
        height="6"
        rx="3"
        fill="var(--color-brand-deep)"
        fillOpacity="0.35"
      />
      <circle cx="11.5" cy="15" r="1.1" fill="var(--color-surface)" fillOpacity="0.85" />
      <circle cx="15.5" cy="15" r="1.1" fill="var(--color-surface)" fillOpacity="0.55" />
      <circle cx="19.5" cy="15" r="1.1" fill="var(--color-surface)" fillOpacity="0.35" />
      <rect x="10" y="20" width="28" height="16" rx="3.5" fill={`url(#${screen})`} />
      <ellipse cx="18" cy="14" rx="12" ry="5" fill={`url(#${shine})`} />
      <path
        d="M14.5 27.5 12 30l2.5 2.5M22 32h7M33.5 27.5 36 30l-2.5 2.5"
        stroke="var(--color-brand-strong)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 24.5h4.5"
        stroke="var(--color-web)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AiMlIcon({ idSuffix = "ai", ...props }: DomainIconProps) {
  const chip = `ai-chip-${idSuffix}`;
  const glow = `ai-glow-${idSuffix}`;
  const node = `ai-node-${idSuffix}`;

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient
          id={chip}
          x1="14"
          y1="14"
          x2="34"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-ai)" />
          <stop offset="1" stopColor="var(--color-brand-deep)" />
        </linearGradient>
        <linearGradient id={glow} x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-ai)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-ai-bg)" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id={node}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(24 24) scale(10)"
        >
          <stop stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-ai-bg)" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="17" fill={`url(#${glow})`} />
      <path
        d="M12 24h5M31 24h5M24 12v5M24 31v5M15.5 15.5l3.5 3.5M29 29l3.5 3.5M32.5 15.5 29 19M19 29l-3.5 3.5"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <rect x="15" y="15" width="18" height="18" rx="5" fill={`url(#${chip})`} />
      <rect x="18.5" y="18.5" width="11" height="11" rx="2.5" fill={`url(#${node})`} />
      <circle
        cx="12"
        cy="24"
        r="2.6"
        fill="var(--color-ai-bg)"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
      />
      <circle
        cx="36"
        cy="15"
        r="2.6"
        fill="var(--color-ai-bg)"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
      />
      <circle
        cx="36"
        cy="33"
        r="2.6"
        fill="var(--color-ai-bg)"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
      />
      <circle cx="24" cy="24" r="2" fill="var(--color-surface)" fillOpacity="0.9" />
      <path
        d="M14.6 24h1.8M32.6 15h1.8M32.6 33h1.8"
        stroke="var(--color-ai)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MobileDevIcon({ idSuffix = "mobile", ...props }: DomainIconProps) {
  const body = `mobile-body-${idSuffix}`;
  const screen = `mobile-screen-${idSuffix}`;
  const shine = `mobile-shine-${idSuffix}`;

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient id={body} x1="15" y1="5" x2="33" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-mobile)" />
          <stop offset="1" stopColor="var(--color-brand-strong)" />
        </linearGradient>
        <linearGradient
          id={screen}
          x1="19"
          y1="11"
          x2="29"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-mobile-bg)" />
        </linearGradient>
        <linearGradient
          id={shine}
          x1="17"
          y1="7"
          x2="27"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--color-surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="15" y="5" width="18" height="38" rx="5.5" fill={`url(#${body})`} />
      <rect
        x="17.5"
        y="7.5"
        width="13"
        height="3"
        rx="1.5"
        fill="var(--color-surface)"
        fillOpacity="0.25"
      />
      <rect x="18.5" y="11.5" width="11" height="24" rx="2.5" fill={`url(#${screen})`} />
      <ellipse cx="21" cy="10" rx="6" ry="3" fill={`url(#${shine})`} />
      <rect
        x="20.5"
        y="15"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-mobile)"
        fillOpacity="0.85"
      />
      <rect
        x="24.8"
        y="15"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-mobile)"
        fillOpacity="0.65"
      />
      <rect
        x="20.5"
        y="19.5"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-mobile)"
        fillOpacity="0.65"
      />
      <rect
        x="24.8"
        y="19.5"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-brand-strong)"
        fillOpacity="0.75"
      />
      <path
        d="M22.2 26.2 24 28.4l3.4-4.2"
        stroke="var(--color-mobile)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="37.5" r="2" fill="var(--color-surface)" fillOpacity="0.85" />
    </svg>
  );
}

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
      {/* Nav */}
      <header className="border-border/60 bg-canvas/80 sticky top-0 z-50 border-b backdrop-blur-sm">
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
        {/* Hero */}
        <section className="bg-warm-wash overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              <p className="eyebrow">Internships that actually teach you something</p>

              <h1 className="mt-4 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Learn by building <span className="text-brand">real projects</span>, not
                watching slides
              </h1>

              <p className="text-ink-secondary mx-auto mt-6 max-w-lg text-base leading-relaxed sm:text-lg">
                Pick a domain, get GitHub-based tasks from our team, and finish with an offer
                letter and certificate you can show employers.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className={primaryBtn}>
                  Get started
                </Link>
                <a href="#how-it-works" className={outlineBtn}>
                  See how it works
                </a>
              </div>
            </div>

            {/* Scattered domain cards — centered below headline */}
            <div className="relative mx-auto mt-12 h-52 w-full max-w-md sm:mt-14 sm:h-60 sm:max-w-lg lg:mt-16 lg:h-64 lg:max-w-xl">
              {DOMAINS.map((domain) => (
                <HeroDomainCard key={domain.id} domain={domain} />
              ))}
            </div>
          </div>
        </section>

        {/* Domains */}
        <section id="domains" className="section-pad scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow-brand">Choose your field</p>
            <h2 className="section-heading mt-3">Three domains, one serious internship</h2>
            <p className="section-lead">
              Every track gives you structured tasks in a real repo — the difference is what you
              build.
            </p>

            <ul className="border-brand/20 divide-border mt-10 divide-y border-y">
              {DOMAINS.map((domain) => (
                <DomainListItem key={domain.id} domain={domain} />
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section-pad section-accent-wash scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow-brand">Simple pricing</p>
            <h2 className="section-heading mt-3">Pick the plan that fits your pace</h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
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
              <PricingCard
                name="Premium"
                price="₹999"
                duration="Up to 3 months, you choose"
                features={[
                  "Regular 1:1 Google Meet sessions",
                  "Hand-picked substantial tasks from our team",
                  "Offer letter + certificate on completion",
                ]}
                highlighted
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="section-pad scroll-mt-20">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow-brand">How it works</p>
            <h2 className="section-heading mt-3">From signup to certificate</h2>

            <ol className="divide-border border-brand/20 mt-10 space-y-0 divide-y border-y">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5 py-6">
                  <span className="bg-brand text-surface flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="item-title">{step.title}</h3>
                    <p className="section-body mt-1.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
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

function DomainListItem({ domain }: { domain: Domain }) {
  return (
    <li className="border-brand border-l-[3px] py-5 pl-5">
      <h3 className="item-title text-brand">{domain.name}</h3>
      <p className="section-body mt-1.5">{domain.sectionDescription}</p>
    </li>
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
      className={`bg-surface flex flex-col rounded-xl border p-8 shadow-sm ${
        highlighted
          ? "border-brand ring-brand/15 ring-2"
          : "border-border hover:border-brand/30"
      }`}
    >
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
