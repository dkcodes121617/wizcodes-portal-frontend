import Link from "next/link";
import type { CSSProperties, SVGProps } from "react";

/* -------------------------------------------------------------------------- */
/*  Domain data                                                               */
/* -------------------------------------------------------------------------- */

const DOMAINS = [
  {
    id: "web",
    name: "Web Development",
    heroDescription: "Build & ship",
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
    heroDescription: "Train & tune",
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
    heroDescription: "Design & build",
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
    title: "Sign up",
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
  "border-border bg-surface hover:bg-surface-raised text-ink inline-flex items-center justify-center rounded-full border px-6 py-2.5 text-sm font-medium transition-colors";
const ghostLink = "text-ink-secondary hover:text-ink text-sm font-medium transition-colors";

/* -------------------------------------------------------------------------- */
/*  Clay-style domain icons (token colors only)                               */
/* -------------------------------------------------------------------------- */

function WebDevIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <rect x="6" y="10" width="36" height="26" rx="6" className="fill-baby" />
      <rect x="10" y="14" width="28" height="18" rx="3" className="fill-surface" />
      <path
        d="M16 24h6M22 20v8M28 22l4 4-4 4"
        className="stroke-web"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AiMlIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <rect x="14" y="14" width="20" height="20" rx="5" className="fill-ai-bg" />
      <rect x="18" y="18" width="12" height="12" rx="3" className="fill-ai" />
      <circle cx="12" cy="24" r="3" className="fill-baby" />
      <circle cx="36" cy="16" r="3" className="fill-baby" />
      <circle cx="36" cy="32" r="3" className="fill-baby" />
      <path d="M15 24h3M33 16l-2 2M33 32l-2-2" className="stroke-ai" strokeWidth="1.5" />
    </svg>
  );
}

function MobileDevIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <rect x="16" y="6" width="16" height="36" rx="5" className="fill-mobile-bg" />
      <rect x="19" y="10" width="10" height="24" rx="2" className="fill-surface" />
      <circle cx="24" cy="38" r="2" className="fill-mobile" />
      <rect x="21" y="8" width="6" height="2" rx="1" className="fill-mobile" />
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
        className={`border-border/60 border p-3 sm:p-4 ${
          domain.dark ? "spotlight border-border-on-dark" : `${domain.tintClass} text-ink`
        }`}
      >
        <Icon className="mx-auto h-10 w-10 sm:h-12 sm:w-12" />
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
            <a href="#domains" className="hover:text-ink transition-colors">
              Domains
            </a>
            <a href="#pricing" className="hover:text-ink transition-colors">
              Pricing
            </a>
            <a href="#how-it-works" className="hover:text-ink transition-colors">
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
                Learn by building <span className="text-ink-secondary">real projects</span>, not
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
        <section id="domains" className="scroll-mt-20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow">Choose your field</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Three domains, one serious internship
            </h2>
            <p className="text-ink-secondary mt-4 max-w-2xl text-base">
              Every track gives you structured tasks in a real repo — the difference is what you
              build.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {DOMAINS.map((domain) => (
                <DomainGridCard key={domain.id} domain={domain} />
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-surface-raised scroll-mt-20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow">Simple pricing</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Pick the plan that fits your pace
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
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
        <section id="how-it-works" className="scroll-mt-20 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              From signup to certificate
            </h2>

            <ol className="mt-12 space-y-8">
              {STEPS.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="bg-brand text-surface flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-ink-secondary mt-1 text-sm leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border border-t px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <nav className="text-ink-secondary flex flex-wrap gap-6 text-sm" aria-label="Footer">
            <a href="#domains" className="hover:text-ink transition-colors">
              Domains
            </a>
            <a href="#pricing" className="hover:text-ink transition-colors">
              Pricing
            </a>
            <Link href="/login" className="hover:text-ink transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-ink transition-colors">
              Sign Up
            </Link>
          </nav>
          <p className="text-ink-muted text-sm">
            © {new Date().getFullYear()} WizCodes. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

function DomainGridCard({ domain }: { domain: Domain }) {
  const { Icon } = domain;

  return (
    <article className="border-border bg-surface rounded-2xl border p-6 shadow-sm">
      <div
        className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${domain.tintClass}`}
      >
        <Icon className="h-9 w-9" />
      </div>
      <h3 className={`mt-4 text-lg font-semibold ${domain.accentClass}`}>{domain.name}</h3>
      <p className="text-ink-secondary mt-2 text-sm leading-relaxed">
        {domain.sectionDescription}
      </p>
    </article>
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
      className={`border-border bg-surface flex flex-col rounded-2xl border p-8 shadow-sm ${
        highlighted ? "ring-brand ring-2 ring-offset-2" : ""
      }`}
    >
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="mt-2 text-4xl font-semibold tracking-tight">
        {price}
        <span className="text-ink-muted text-base font-normal"> / internship</span>
      </p>
      <p className="text-ink-secondary mt-2 text-sm">{duration}</p>

      <ul className="text-ink-secondary mt-6 flex-1 space-y-3 text-sm">
        {features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span className="text-brand mt-0.5" aria-hidden>
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
