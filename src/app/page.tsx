import { AiMlIcon, MobileDevIcon, WebDevIcon } from "@/components/landing/domain-icons";
import { DomainBentoGrid, DomainBentoHeader } from "@/components/landing/DomainBentoGrid";
import { FinalCtaSection } from "@/components/landing/FinalCtaSection";
import { HeroBadge } from "@/components/landing/HeroBadge";
import { HeroExperience } from "@/components/landing/HeroExperience";
import { HowItWorksTimeline } from "@/components/landing/HowItWorksTimeline";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { ScrollReveal } from "@/components/landing/ScrollReveal";
import { StatsStrip } from "@/components/landing/StatsStrip";
import { TrustBar } from "@/components/landing/TrustBar";
import { WhySection } from "@/components/landing/WhySection";
import Link from "next/link";

const DOMAINS = [
  {
    id: "web" as const,
    name: "Web Development",
    sectionDescription:
      "Build components, integrate APIs, and ship features the way product teams do.",
    tintClass: "bg-web-bg",
    accentClass: "text-web",
    Icon: WebDevIcon,
  },
  {
    id: "ai" as const,
    name: "AI / ML",
    sectionDescription:
      "Train models, work with datasets, and document outcomes like an ML engineer.",
    tintClass: "bg-ai-bg",
    accentClass: "text-ai",
    Icon: AiMlIcon,
  },
  {
    id: "mobile" as const,
    name: "Mobile Development",
    sectionDescription:
      "Design screens, wire navigation, and connect APIs for apps you can demo.",
    tintClass: "bg-mobile-bg",
    accentClass: "text-mobile",
    Icon: MobileDevIcon,
  },
];

const STEPS = [
  { title: "Create account", detail: "Sign up with your student details in a few minutes." },
  { title: "Choose track", detail: "Select Web, AI, or Mobile and pick Basic or Premium." },
  { title: "Complete payment", detail: "Pay once and upload your payment confirmation." },
  { title: "Work on tasks", detail: "Receive assignments with clear scope, stack, and goals." },
  {
    title: "Get certified",
    detail: "Finish your track and receive your offer letter and certificate.",
  },
];

export default function Home() {
  return (
    <>
      <LandingNav />

      <main>
        <HeroExperience>
          <HeroBadge />

          <h1 className="display-heading mt-5">
            Learn by building.
            <span className="text-brand block sm:inline"> Graduate with proof.</span>
          </h1>

          <p className="text-ink-secondary mt-6 max-w-xl text-base leading-relaxed sm:text-[1.0625rem] lg:mx-0">
            WizCodes gives students structured internship tasks across Web, AI, and Mobile —
            with certificates employers recognize. Plans start at ₹299.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link href="/signup" className="btn-primary btn-primary-lg">
              Start internship
            </Link>
            <a href="#domains" className="btn-secondary">
              View domains
            </a>
          </div>

          <TrustBar />
        </HeroExperience>

        <StatsStrip />

        <WhySection />

        <section id="domains" className="section-pad section-surface scroll-mt-20">
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

        <section id="pricing" className="section-pad scroll-mt-20">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <p className="section-eyebrow">Pricing</p>
              <h2 className="section-heading mt-3">One payment. Full access.</h2>
              <p className="section-lead">
                No monthly subscriptions. Pick the plan that fits your schedule and goals.
              </p>
            </ScrollReveal>

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <ScrollReveal delay={0.05}>
                <PricingCard
                  name="Basic"
                  price="₹299"
                  duration="2 to 6 weeks"
                  features={[
                    "Choose your duration within the range",
                    "Assigned real-world tasks",
                    "Offer letter and certificate on completion",
                  ]}
                />
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <PricingCard
                  name="Premium"
                  price="₹999"
                  duration="Up to 3 months"
                  features={[
                    "1:1 support from our team",
                    "Curated, substantial task list",
                    "Offer letter and certificate on completion",
                  ]}
                  highlighted
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        <HowItWorksTimeline steps={STEPS} />

        <FinalCtaSection />
      </main>

      <LandingFooter />
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
    <article className={`pricing-panel ${highlighted ? "pricing-panel-featured" : ""}`}>
      {highlighted ? <span className="pricing-panel-badge">Recommended</span> : null}

      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-ink text-lg font-semibold">{name}</h3>
        <p className="text-ink-muted text-sm">{duration}</p>
      </div>

      <p className="pricing-panel-price mt-5">{price}</p>
      <p className="text-ink-muted mt-1 text-sm">per internship</p>

      <ul className="border-border mt-8 space-y-3 border-t pt-8">
        {features.map((feature) => (
          <li key={feature} className="pricing-panel-feature">
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={`mt-8 w-full text-center ${highlighted ? "btn-primary" : "btn-secondary"}`}
      >
        Get started
      </Link>
    </article>
  );
}
